package com.nestbridge.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nestbridge.booking.Booking;
import com.nestbridge.booking.BookingRepository;
import com.nestbridge.common.BookingStatus;
import com.nestbridge.notification.BookingNotificationService;
import com.nestbridge.user.ProfileGateService;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaystackService {

    private static final List<String> CHECKOUT_CHANNELS = List.of(
            "card",
            "mobile_money",
            "bank",
            "ussd",
            "bank_transfer"
    );

    private final BookingRepository bookingRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final UserRepository userRepository;
    private final ProfileGateService profileGateService;
    private final BookingNotificationService bookingNotificationService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    @Value("${paystack.enabled:false}")
    private boolean paystackEnabled;

    @Value("${paystack.secret-key:}")
    private String secretKey;

    @Value("${app.public-url:http://localhost:8080}")
    private String publicUrl;

    public boolean isLivePaystack() {
        return paystackEnabled && secretKey != null && !secretKey.isBlank();
    }

    @Transactional
    public PaymentInitializeResponse initializePayment(UUID bookingId, UUID guestId) {
        return initializePayment(bookingId, guestId, null);
    }

    @Transactional
    public PaymentInitializeResponse initializePayment(
            UUID bookingId,
            UUID guestId,
            List<String> preferredChannels) {
        profileGateService.requireEmailVerified(guestId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if (!booking.getGuestId().equals(guestId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized.");
        }
        if (booking.getStatus() == BookingStatus.CONFIRMED
                || "PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            throw new IllegalStateException("This booking is already paid.");
        }
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalArgumentException("Booking must be accepted before payment.");
        }
        if (booking.getTotalPrice() == null || booking.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Booking total is invalid for payment.");
        }

        if (!isLivePaystack()) {
            log.info("Paystack disabled — mock payment for booking {}", bookingId);
            return PaymentInitializeResponse.builder()
                    .mockPayment(true)
                    .bookingId(bookingId.toString())
                    .amount(booking.getTotalPrice())
                    .currency("GHS")
                    .build();
        }

        if (paymentRecordRepository.existsByBookingIdAndStatus(bookingId, "SUCCESS")) {
            throw new IllegalStateException("This booking is already paid.");
        }

        // Abandon prior pending checkouts so only one active reference is charged.
        paymentRecordRepository.findByBookingIdAndStatus(bookingId, "PENDING")
                .forEach(pending -> {
                    pending.setStatus("ABANDONED");
                    paymentRecordRepository.save(pending);
                });

        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        String reference = "nb-" + bookingId.toString().replace("-", "").substring(0, 12)
                + "-" + System.currentTimeMillis();
        long amountPesewas = toPesewas(booking.getTotalPrice());
        List<String> channels = resolveChannels(preferredChannels);

        try {
            String callbackUrl = publicUrl.replaceAll("/$", "") + "/api/payments/callback";
            String body = objectMapper.writeValueAsString(Map.of(
                    "email", guest.getEmail(),
                    "amount", amountPesewas,
                    "currency", "GHS",
                    "reference", reference,
                    "callback_url", callbackUrl,
                    "channels", channels,
                    "metadata", Map.of(
                            "booking_id", bookingId.toString(),
                            "guest_id", guestId.toString(),
                            "custom_fields", List.of(
                                    Map.of(
                                            "display_name", "Booking",
                                            "variable_name", "booking_id",
                                            "value", bookingId.toString()
                                    )
                            )
                    )
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.paystack.co/transaction/initialize"))
                    .timeout(Duration.ofSeconds(30))
                    .header("Authorization", "Bearer " + secretKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode json = objectMapper.readTree(response.body());
            if (!json.path("status").asBoolean(false)) {
                log.error("Paystack initialize failed: {}", response.body());
                throw new IllegalStateException("Could not start payment. Please try again.");
            }

            String authorizationUrl = json.path("data").path("authorization_url").asText();
            if (authorizationUrl == null || authorizationUrl.isBlank()) {
                throw new IllegalStateException("Could not start payment. Missing checkout URL.");
            }

            PaymentRecord record = PaymentRecord.builder()
                    .bookingId(bookingId)
                    .paystackReference(reference)
                    .amount(booking.getTotalPrice())
                    .currency("GHS")
                    .status("PENDING")
                    .build();
            paymentRecordRepository.save(record);

            log.info(
                    "Paystack checkout created bookingId={} reference={} amount={} GHS channels={}",
                    bookingId,
                    reference,
                    booking.getTotalPrice(),
                    channels);

            return PaymentInitializeResponse.builder()
                    .mockPayment(false)
                    .authorizationUrl(authorizationUrl)
                    .reference(reference)
                    .bookingId(bookingId.toString())
                    .amount(booking.getTotalPrice())
                    .currency("GHS")
                    .build();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Payment initialization interrupted.");
        } catch (ResponseStatusException | IllegalStateException | IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Paystack initialize error", e);
            throw new IllegalStateException("Could not start payment. Please try again.");
        }
    }

    private List<String> resolveChannels(List<String> preferredChannels) {
        if (preferredChannels == null || preferredChannels.isEmpty()) {
            return CHECKOUT_CHANNELS;
        }
        List<String> allowed = preferredChannels.stream()
                .filter(channel -> channel != null && !channel.isBlank())
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(CHECKOUT_CHANNELS::contains)
                .distinct()
                .toList();
        return allowed.isEmpty() ? CHECKOUT_CHANNELS : allowed;
    }

    /**
     * App calls this after returning from Paystack checkout to confirm payment
     * without waiting solely on the webhook.
     */
    @Transactional
    public PaymentVerifyResponse verifyPaymentForGuest(UUID bookingId, UUID guestId) {
        profileGateService.requireEmailVerified(guestId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if (!booking.getGuestId().equals(guestId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized.");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED
                || "PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            return PaymentVerifyResponse.builder()
                    .paid(true)
                    .bookingStatus(booking.getStatus().name())
                    .paymentStatus(booking.getPaymentStatus())
                    .message("Payment already confirmed.")
                    .build();
        }

        if (!isLivePaystack()) {
            return PaymentVerifyResponse.builder()
                    .paid(false)
                    .bookingStatus(booking.getStatus().name())
                    .paymentStatus(booking.getPaymentStatus())
                    .message("Live payment is not enabled.")
                    .build();
        }

        PaymentRecord pending = paymentRecordRepository
                .findTopByBookingIdAndStatusOrderByCreatedAtDesc(bookingId, "PENDING")
                .orElse(null);
        if (pending == null) {
            PaymentRecord success = paymentRecordRepository
                    .findTopByBookingIdAndStatusOrderByCreatedAtDesc(bookingId, "SUCCESS")
                    .orElse(null);
            if (success != null) {
                completeBookingPayment(bookingId);
                Booking refreshed = bookingRepository.findById(bookingId).orElse(booking);
                return PaymentVerifyResponse.builder()
                        .paid(true)
                        .reference(success.getPaystackReference())
                        .bookingStatus(refreshed.getStatus().name())
                        .paymentStatus(refreshed.getPaymentStatus())
                        .message("Payment successful.")
                        .build();
            }
            return PaymentVerifyResponse.builder()
                    .paid(false)
                    .bookingStatus(booking.getStatus().name())
                    .paymentStatus(booking.getPaymentStatus())
                    .message("No pending payment found. Tap Pay now to try again.")
                    .build();
        }

        boolean paid = verifyAndCompleteByReference(pending.getPaystackReference());
        Booking refreshed = bookingRepository.findById(bookingId).orElse(booking);
        return PaymentVerifyResponse.builder()
                .paid(paid)
                .reference(pending.getPaystackReference())
                .bookingStatus(refreshed.getStatus().name())
                .paymentStatus(refreshed.getPaymentStatus())
                .message(paid
                        ? "Payment successful."
                        : "Payment not confirmed yet. If you were charged, wait a moment and retry.")
                .build();
    }

    @Transactional
    public void handleWebhook(String rawBody, String signature) {
        if (!isLivePaystack()) {
            log.warn("Ignoring Paystack webhook — live payments disabled.");
            return;
        }
        if (!verifySignature(rawBody, signature)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Paystack signature.");
        }

        try {
            JsonNode event = objectMapper.readTree(rawBody);
            String eventName = event.path("event").asText();
            if (!"charge.success".equals(eventName)) {
                log.info("Ignoring Paystack event {}", eventName);
                return;
            }
            JsonNode data = event.path("data");
            String reference = data.path("reference").asText();
            applySuccessfulCharge(reference, data);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Paystack webhook error", e);
            throw new IllegalStateException("Webhook processing failed.");
        }
    }

    /**
     * Paystack browser redirect lands here after checkout. Verifies the
     * transaction with Paystack and confirms the booking when paid.
     */
    @Transactional
    public boolean verifyAndCompleteByReference(String reference) {
        if (reference == null || reference.isBlank()) {
            return false;
        }
        if (!isLivePaystack()) {
            return false;
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.paystack.co/transaction/verify/" + reference))
                    .timeout(Duration.ofSeconds(30))
                    .header("Authorization", "Bearer " + secretKey)
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode json = objectMapper.readTree(response.body());
            if (!json.path("status").asBoolean(false)) {
                log.warn("Paystack verify failed for {}: {}", reference, response.body());
                return false;
            }
            JsonNode data = json.path("data");
            if (!"success".equalsIgnoreCase(data.path("status").asText())) {
                log.info("Paystack verify reference {} status={}", reference, data.path("status").asText());
                return false;
            }
            applySuccessfulCharge(reference, data);
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Paystack verify interrupted for {}", reference, e);
            return false;
        } catch (Exception e) {
            log.error("Paystack verify error for {}", reference, e);
            return false;
        }
    }

    private void applySuccessfulCharge(String reference, JsonNode data) {
        PaymentRecord payment = paymentRecordRepository.findByPaystackReference(reference)
                .orElseThrow(() -> new IllegalArgumentException("Unknown payment reference."));
        if ("SUCCESS".equals(payment.getStatus())) {
            completeBookingPayment(payment.getBookingId());
            return;
        }

        long expectedPesewas = toPesewas(payment.getAmount());
        long paidPesewas = data.path("amount").asLong(-1);
        if (paidPesewas >= 0 && paidPesewas != expectedPesewas) {
            log.error(
                    "Paystack amount mismatch reference={} expected={} paid={}",
                    reference,
                    expectedPesewas,
                    paidPesewas);
            payment.setStatus("FAILED");
            payment.setRawPayload(objectMapper.convertValue(data, Map.class));
            paymentRecordRepository.save(payment);
            throw new IllegalStateException("Payment amount did not match the booking total.");
        }

        String currency = data.path("currency").asText("GHS");
        if (!"GHS".equalsIgnoreCase(currency)) {
            log.error("Paystack currency mismatch reference={} currency={}", reference, currency);
            payment.setStatus("FAILED");
            payment.setRawPayload(objectMapper.convertValue(data, Map.class));
            paymentRecordRepository.save(payment);
            throw new IllegalStateException("Payment currency is not supported.");
        }

        payment.setStatus("SUCCESS");
        payment.setCompletedAt(OffsetDateTime.now());
        payment.setRawPayload(objectMapper.convertValue(data, Map.class));
        paymentRecordRepository.save(payment);

        completeBookingPayment(payment.getBookingId());
    }

    @Transactional
    public void completeBookingPayment(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if (booking.getStatus() == BookingStatus.CONFIRMED
                && "PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            return;
        }
        if (booking.getStatus() == BookingStatus.CANCELLED
                || booking.getStatus() == BookingStatus.DECLINED
                || booking.getStatus() == BookingStatus.EXPIRED) {
            log.warn(
                    "Skipping booking confirm for {} — status is {}",
                    bookingId,
                    booking.getStatus());
            return;
        }
        if (booking.getStatus() != BookingStatus.ACCEPTED
                && booking.getStatus() != BookingStatus.CONFIRMED) {
            log.warn(
                    "Unexpected booking status {} while completing payment for {}",
                    booking.getStatus(),
                    bookingId);
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus("PAID");
        bookingRepository.save(booking);
        bookingNotificationService.onBookingConfirmed(booking);
    }

    private static long toPesewas(BigDecimal amountGhs) {
        return amountGhs
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private boolean verifySignature(String payload, String signature) {
        if (signature == null || signature.isBlank()) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computed = HexFormat.of().formatHex(hash);
            return computed.equalsIgnoreCase(signature);
        } catch (Exception e) {
            log.error("Signature verification failed", e);
            return false;
        }
    }
}
