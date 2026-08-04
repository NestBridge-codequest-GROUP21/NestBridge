package com.nestbridge.kyc;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nestbridge.notification.StaffNotificationService;
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
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmileIdentityService {

    private final UserRepository userRepository;
    private final KycVerificationJobRepository jobRepository;
    private final StaffNotificationService staffNotificationService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${smile.enabled:false}")
    private boolean smileEnabled;

    @Value("${smile.partner-id:}")
    private String partnerId;

    @Value("${smile.api-key:}")
    private String apiKey;

    @Value("${smile.callback-url:}")
    private String callbackUrl;

    @Value("${smile.environment:sandbox}")
    private String environment;

    @Transactional
    public KycSessionResponse createSession(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Optional<KycVerificationJob> existingPending = jobRepository
                .findTopByUserIdOrderByCreatedAtDesc(userId)
                .filter(job -> "PENDING".equals(job.getStatus()));

        if (!smileEnabled || partnerId == null || partnerId.isBlank()
                || apiKey == null || apiKey.isBlank()) {
            log.warn("Smile Identity not configured — queueing manual KYC review for user {}", userId);
            KycVerificationJob job;
            if (existingPending.isPresent()) {
                job = existingPending.get();
            } else {
                job = jobRepository.save(KycVerificationJob.builder()
                        .userId(userId)
                        .provider("MANUAL")
                        .status("PENDING")
                        .build());
                staffNotificationService.onManualKycPending(user);
            }
            return KycSessionResponse.builder()
                    .enabled(false)
                    .jobId(job.getJobId().toString())
                    .message("Your verification is pending manual review")
                    .build();
        }

        if (existingPending.isPresent()) {
            KycVerificationJob job = existingPending.get();
            return KycSessionResponse.builder()
                    .enabled(true)
                    .verificationUrl(job.getVerificationUrl())
                    .jobId(job.getJobId().toString())
                    .message("Open the verification link to complete ID check.")
                    .build();
        }

        try {
            String timestamp = Instant.now().toString();
            String signature = generateSignature(timestamp);

            Map<String, Object> body = Map.of(
                    "partner_id", partnerId,
                    "callback_url", callbackUrl,
                    "name", user.getFullName(),
                    "company_name", "NestBridge",
                    "id_types", new String[] { "NATIONAL_ID", "PASSPORT", "DRIVERS_LICENSE" },
                    "is_single_use", true,
                    "user_id", userId.toString()
            );

            String json = objectMapper.writeValueAsString(body);
            String baseUrl = "production".equalsIgnoreCase(environment)
                    ? "https://api.smileidentity.com/v1"
                    : "https://testapi.smileidentity.com/v1";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/smile_links"))
                    .header("Content-Type", "application/json")
                    .header("smileid-partner-id", partnerId)
                    .header("smileid-request-signature", signature)
                    .header("smileid-timestamp", timestamp)
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode result = objectMapper.readTree(response.body());

            if (response.statusCode() >= 400) {
                log.error("Smile link failed ({}): {}", response.statusCode(), response.body());
                throw new IllegalStateException("Could not start identity verification.");
            }

            String linkUrl = result.path("link").asText(null);
            if (linkUrl == null || linkUrl.isBlank()) {
                linkUrl = result.path("data").path("link").asText(null);
            }
            if (linkUrl == null || linkUrl.isBlank()) {
                throw new IllegalStateException("Smile did not return a verification link.");
            }

            KycVerificationJob job = KycVerificationJob.builder()
                    .userId(userId)
                    .provider("SMILE")
                    .externalJobId(result.path("ref_id").asText(null))
                    .status("PENDING")
                    .verificationUrl(linkUrl)
                    .build();
            job = jobRepository.save(job);

            return KycSessionResponse.builder()
                    .enabled(true)
                    .verificationUrl(linkUrl)
                    .jobId(job.getJobId().toString())
                    .message("Open the verification link to complete ID check.")
                    .build();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Verification request interrupted.");
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("Smile session error", e);
            throw new IllegalStateException("Could not start identity verification.");
        }
    }

    /**
     * Smile webhook: only when enabled; HMAC of raw body with API key; must match a PENDING job.
     */
    @Transactional
    public void handleCallback(String rawBody, String signature) {
        if (!smileEnabled) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Smile Identity webhooks are disabled.");
        }
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Smile Identity is not configured.");
        }
        if (!verifyWebhookSignature(rawBody, signature)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Smile signature.");
        }

        Map<String, Object> payload;
        try {
            payload = objectMapper.readValue(rawBody, new TypeReference<>() {});
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid webhook payload.");
        }

        Object userIdRaw = payload.get("user_id");
        if (userIdRaw == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing user_id.");
        }
        UUID userId;
        try {
            userId = UUID.fromString(userIdRaw.toString());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user_id.");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown user_id.");
        }

        String externalJobId = firstNonBlank(
                stringVal(payload.get("ref_id")),
                stringVal(payload.get("PartnerParams") instanceof Map<?, ?> m
                        ? m.get("job_id")
                        : null),
                stringVal(payload.get("external_job_id")));

        Optional<KycVerificationJob> jobOpt = Optional.empty();
        if (externalJobId != null) {
            jobOpt = jobRepository.findByExternalJobId(externalJobId)
                    .filter(job -> "PENDING".equals(job.getStatus())
                            && userId.equals(job.getUserId()));
        }
        if (jobOpt.isEmpty()) {
            jobOpt = jobRepository.findTopByUserIdAndStatusOrderByCreatedAtDesc(userId, "PENDING");
        }
        if (jobOpt.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No pending verification job for this user.");
        }

        KycVerificationJob job = jobOpt.get();
        Object resultCode = payload.get("ResultCode");
        boolean approved = "0810".equals(String.valueOf(resultCode))
                || "1012".equals(String.valueOf(resultCode))
                || "SUCCESS".equalsIgnoreCase(String.valueOf(payload.get("status")));

        job.setStatus(approved ? "APPROVED" : "REJECTED");
        job.setResultPayload(redactSensitivePayload(payload));
        job.setCompletedAt(java.time.OffsetDateTime.now());
        jobRepository.save(job);

        if (approved) {
            user.setIdentityVerified(true);
            userRepository.save(user);
            staffNotificationService.onKycApproved(user);
        } else {
            String reason = firstNonBlank(
                    stringVal(payload.get("ResultText")),
                    stringVal(payload.get("result_text")),
                    "Identity verification was not approved.");
            job.setRejectionReason(reason);
            jobRepository.save(job);
            staffNotificationService.onKycRejected(user, reason);
        }
    }

    boolean verifyWebhookSignature(String payload, String signature) {
        if (signature == null || signature.isBlank() || payload == null) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(apiKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String hex = HexFormat.of().formatHex(hash);
            String b64 = Base64.getEncoder().encodeToString(hash);
            return hex.equalsIgnoreCase(signature.trim())
                    || b64.equals(signature.trim());
        } catch (Exception e) {
            log.error("Smile signature verification failed", e);
            return false;
        }
    }

    private static Map<String, Object> redactSensitivePayload(Map<String, Object> payload) {
        if (payload == null) {
            return null;
        }
        java.util.HashMap<String, Object> copy = new java.util.HashMap<>(payload);
        for (String key : List.of(
                "IDNumber", "id_number", "idNumber", "DocumentNumber",
                "FullName", "full_name", "DOB", "dob", "PhoneNumber", "phone_number")) {
            if (copy.containsKey(key)) {
                copy.put(key, "[REDACTED]");
            }
        }
        return copy;
    }

    private static String stringVal(Object value) {
        if (value == null) {
            return null;
        }
        String s = value.toString().trim();
        return s.isEmpty() ? null : s;
    }

    private static String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }
        for (String v : values) {
            if (v != null && !v.isBlank()) {
                return v;
            }
        }
        return null;
    }

    private String generateSignature(String timestamp) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(apiKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        String message = timestamp + partnerId + "sid_request";
        byte[] hash = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }
}
