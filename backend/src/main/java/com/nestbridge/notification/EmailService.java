package com.nestbridge.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class EmailService {

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${email.sendgrid-api-key:}")
    private String sendGridApiKey;

    @Value("${email.from-address:noreply@nestbridge.app}")
    private String fromAddress;

    @Value("${email.from-name:NestBridge}")
    private String fromName;

    public void sendVerificationEmail(String toEmail, String displayName, String verifyUrl) {
        String subject = "Verify your NestBridge account";
        String plainBody = """
                Hi %s,

                Thanks for joining NestBridge. Please verify your email address by opening this link:

                %s

                This link expires in 24 hours. If you did not create an account, you can ignore this email.

                — The NestBridge team
                """.formatted(displayName, verifyUrl);
        sendPlainEmail(toEmail, subject, plainBody, verifyUrl);
    }

    public void sendPlainEmail(String toEmail, String subject, String plainBody) {
        sendPlainEmail(toEmail, subject, plainBody, null);
    }

    private void sendPlainEmail(String toEmail, String subject, String plainBody, String devLogExtra) {
        if (sendGridApiKey == null || sendGridApiKey.isBlank()) {
            if (devLogExtra != null) {
                log.warn("SendGrid not configured — email to {} ({}): {}", toEmail, subject, devLogExtra);
            } else {
                log.warn("SendGrid not configured — would email {}: {}", toEmail, subject);
            }
            return;
        }

        String json = """
                {
                  "personalizations": [{"to": [{"email": "%s"}]}],
                  "from": {"email": "%s", "name": "%s"},
                  "subject": "%s",
                  "content": [{"type": "text/plain", "value": %s}]
                }
                """.formatted(
                escapeJson(toEmail),
                escapeJson(fromAddress),
                escapeJson(fromName),
                escapeJson(subject),
                jsonString(plainBody));

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.sendgrid.com/v3/mail/send"))
                    .header("Authorization", "Bearer " + sendGridApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                log.error("SendGrid failed ({}): {}", response.statusCode(), response.body());
                throw new IllegalStateException("Could not send email. Please try again later.");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Could not send email.");
        } catch (Exception e) {
            log.error("SendGrid error", e);
            throw new IllegalStateException("Could not send email. Please try again later.");
        }
    }

    private static String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String jsonString(String value) {
        return "\"" + escapeJson(value).replace("\n", "\\n") + "\"";
    }
}
