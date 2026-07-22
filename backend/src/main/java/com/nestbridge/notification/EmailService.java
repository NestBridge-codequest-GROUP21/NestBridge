package com.nestbridge.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
@Slf4j
public class EmailService {

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${email.sendgrid-api-key:}")
    private String sendGridApiKey;

    @Value("${email.from-address:noreply@nestbridge.app}")
    private String fromAddress;

    @Value("${email.from-name:NestBridge}")
    private String fromName;

    public boolean isConfigured() {
        return sendGridApiKey != null && !sendGridApiKey.isBlank();
    }

    public void sendVerificationEmail(String toEmail, String displayName, String verifyUrl) {
        String subject = "Verify your NestBridge account";
        String plainBody = """
                Hi %s,

                Thanks for joining NestBridge. Please verify your email address by opening this link:

                %s

                This link expires in 24 hours. If you did not create an account, you can ignore this email.

                — The NestBridge team
                """.formatted(displayName, verifyUrl);
        String htmlBody = """
                <p>Hi %s,</p>
                <p>Thanks for joining NestBridge. Please verify your email address:</p>
                <p><a href="%s">Verify my email</a></p>
                <p>Or copy this link into your browser:<br>%s</p>
                <p>This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>
                <p>— The NestBridge team</p>
                """.formatted(escapeHtml(displayName), escapeHtml(verifyUrl), escapeHtml(verifyUrl));
        sendEmail(toEmail, subject, plainBody, htmlBody, verifyUrl);
    }

    public void sendPasswordResetEmail(
            String toEmail,
            String displayName,
            String webResetUrl,
            String appResetUrl) {
        String subject = "Reset your NestBridge password";
        String plainBody = """
                Hi %s,

                We received a request to reset your NestBridge password.

                Open this link to choose a new password (works in your phone browser — you do not need the app open first):

                %s

                Optional — open the same reset screen inside the NestBridge app:

                %s

                This link expires in 1 hour. If you did not request a reset, you can ignore this email.

                — The NestBridge team
                """.formatted(displayName, webResetUrl, appResetUrl);
        String htmlBody = """
                <p>Hi %s,</p>
                <p>We received a request to reset your NestBridge password.</p>
                <p><a href="%s"><strong>Choose a new password</strong></a></p>
                <p>That page lets you type and save a new password in your browser. You can then sign in on NestBridge.</p>
                <p>Optional app link: <a href="%s">Open reset in the NestBridge app</a></p>
                <p>This link expires in 1 hour. If you did not request a reset, you can ignore this email.</p>
                <p>— The NestBridge team</p>
                """.formatted(escapeHtml(displayName), escapeHtml(webResetUrl), escapeHtml(appResetUrl));
        sendEmail(toEmail, subject, plainBody, htmlBody, webResetUrl);
    }

    public void sendPlainEmail(String toEmail, String subject, String plainBody) {
        sendEmail(toEmail, subject, plainBody, null, null);
    }

    private void sendEmail(
            String toEmail,
            String subject,
            String plainBody,
            String htmlBody,
            String debugExtra) {
        if (!isConfigured()) {
            log.error(
                    "SendGrid API key missing — cannot email {} subject=\"{}\" from={} extra={}",
                    toEmail,
                    subject,
                    fromAddress,
                    debugExtra);
            throw new EmailDeliveryException(
                    "Email could not be sent. Email delivery is not configured on the server. Please try again later or contact support.");
        }

        StringBuilder content = new StringBuilder();
        content.append("{\"type\":\"text/plain\",\"value\":").append(jsonString(plainBody)).append('}');
        if (htmlBody != null && !htmlBody.isBlank()) {
            content.append(",{\"type\":\"text/html\",\"value\":").append(jsonString(htmlBody)).append('}');
        }

        String json = """
                {
                  "personalizations": [{"to": [{"email": "%s"}]}],
                  "from": {"email": "%s", "name": "%s"},
                  "subject": "%s",
                  "content": [%s]
                }
                """.formatted(
                escapeJson(toEmail),
                escapeJson(fromAddress),
                escapeJson(fromName),
                escapeJson(subject),
                content);

        try {
            log.info("Sending email via SendGrid to={} from={} subject=\"{}\"", toEmail, fromAddress, subject);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.sendgrid.com/v3/mail/send"))
                    .timeout(Duration.ofSeconds(20))
                    .header("Authorization", "Bearer " + sendGridApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int status = response.statusCode();
            if (status >= 400) {
                log.error(
                        "SendGrid rejected email to={} from={} status={} body={}",
                        toEmail,
                        fromAddress,
                        status,
                        response.body());
                throw new EmailDeliveryException(mapSendGridFailure(status));
            }
            log.info("SendGrid accepted email to={} status={}", toEmail, status);
        } catch (EmailDeliveryException e) {
            throw e;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new EmailDeliveryException("Email could not be sent. Please try again.");
        } catch (Exception e) {
            log.error("SendGrid request failed to={} from={}", toEmail, fromAddress, e);
            throw new EmailDeliveryException(
                    "Email could not be sent. Please try again later.", e);
        }
    }

    private static String mapSendGridFailure(int status) {
        if (status == 401 || status == 403) {
            return "Email could not be sent. The mail provider rejected the request — check SENDGRID_API_KEY and that EMAIL_FROM is a Verified Sender in SendGrid.";
        }
        if (status == 413 || status == 429) {
            return "Email could not be sent right now. Please wait a minute and try again.";
        }
        return "Email could not be sent. Please try again later.";
    }

    private static String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String jsonString(String value) {
        return "\"" + escapeJson(value).replace("\n", "\\n").replace("\r", "") + "\"";
    }

    private static String escapeHtml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
