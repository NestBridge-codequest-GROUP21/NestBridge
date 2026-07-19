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
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaystackService {

    private final BookingRepository bookingRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final UserRepository userRepository;
    private final ProfileGateService profileGateService;
    private final BookingNotificationService bookingNotificationService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${paystack.enabled:false}")
    private boolean paystackEnabled;

    @Value("${paystack.secret-key:}")
    private String secretKey;

    @Value("${app.public-url:http://localhost:8080}")
    private String publicUrl;

    @Transactional
    public PaymentInitializeResponse initializePayment(UUID bookingId, UUID guestId) {
        profileGateService.requireEmailVerified(guestId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if (!booking.getGuestId().equals(guestId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized.");
        }
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalArgumentException("Booking must be accepted before payment.");
        }

        if (!paystackEnabled || secretKey == null || secretKey.isBlank()) {
            log.info("Paystack disabled — mock payment for booking {}", bookingId);
            return PaymentInitializeResponse.builder().mockPayment(true).build();
        }

        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        String reference = "nb-" + bookingId.toString().substring(0, 8) + "-" + System.currentTimeMillis();
        long amountPesewas = booking.getTotalPrice()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();

        try {
            String callbackUrl = publicUrl.replaceAll("/$", "") + "/api/payments/callback";
            String body = objectMapper.writeValueAsString(Map.of(
                    "email", guest.getEmail(),
                    "amount", amountPesewas,
                    "currency", "GHS",
                    "reference", reference,
                    "callback_url", callbackUrl,
                    "metadata", Map.of("booking_id", bookingId.toString())
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.paystack.co/transaction/initialize"))
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
            PaymentRecord record = PaymentRecord.builder()
                    .bookingId(bookingId)
                    .paystackReference(reference)
                    .amount(booking.getTotalPrice())
                    .currency("GHS")
                    .status("PENDING")
                    .build();
            paymentRecordRepository.save(record);

            return PaymentInitializeResponse.builder()
                    .mockPayment(false)
                    .authorizationUrl(authorizationUrl)
                    .reference(reference)
                    .build();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Payment initialization interrupted.");
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Paystack initialize error", e);
            throw new IllegalStateException("Could not start payment. Please try again.");
        }
    }

    @Transactional
    public void handleWebhook(String rawBody, String signature) {
        if (!paystackEnabled || secretKey == null || secretKey.isBlank()) {
            return;
        }
        if (!verifySignature(rawBody, signature)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Paystack signature.");
        }

        try {
            JsonNode event = objectMapper.readTree(rawBody);
            if (!"charge.success".equals(event.path("event").asText())) {
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
        if (!paystackEnabled || secretKey == null || secretKey.isBlank()) {
            return false;
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.paystack.co/transaction/verify/" + reference))
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
            return;
        }

        payment.setStatus("SUCCESS");
        payment.setCompletedAt(java.time.OffsetDateTime.now());
        payment.setRawPayload(objectMapper.convertValue(data, Map.class));
        paymentRecordRepository.save(payment);

        completeBookingPayment(payment.getBookingId());
    }

    @Transactional
    public void completeBookingPayment(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return;
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus("PAID");
        bookingRepository.save(booking);
        bookingNotificationService.onBookingConfirmed(booking);
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
