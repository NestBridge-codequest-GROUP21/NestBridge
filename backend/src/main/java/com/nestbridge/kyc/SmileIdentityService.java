package com.nestbridge.kyc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmileIdentityService {

    private final UserRepository userRepository;
    private final KycVerificationJobRepository jobRepository;
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

        if (!smileEnabled || partnerId == null || partnerId.isBlank()
                || apiKey == null || apiKey.isBlank()) {
            log.warn("Smile Identity not configured — mock KYC for user {}", userId);
            user.setIdentityVerified(true);
            userRepository.save(user);
            return KycSessionResponse.builder()
                    .enabled(false)
                    .message("Identity marked verified (Smile not configured).")
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

    @Transactional
    public void handleCallback(Map<String, Object> payload) {
        Object userIdRaw = payload.get("user_id");
        if (userIdRaw == null) {
            return;
        }
        UUID userId = UUID.fromString(userIdRaw.toString());
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return;
        }

        Object resultCode = payload.get("ResultCode");
        boolean approved = "0810".equals(String.valueOf(resultCode))
                || "1012".equals(String.valueOf(resultCode))
                || "SUCCESS".equalsIgnoreCase(String.valueOf(payload.get("status")));

        jobRepository.findTopByUserIdOrderByCreatedAtDesc(userId).ifPresent(job -> {
            job.setStatus(approved ? "APPROVED" : "REJECTED");
            job.setResultPayload(payload);
            job.setCompletedAt(java.time.OffsetDateTime.now());
            jobRepository.save(job);
        });

        if (approved) {
            user.setIdentityVerified(true);
            userRepository.save(user);
        }
    }

    private String generateSignature(String timestamp) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(apiKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        String message = timestamp + partnerId + "sid_request";
        byte[] hash = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }
}
