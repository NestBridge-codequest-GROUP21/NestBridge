package com.nestbridge.notification;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Surfaced at boot so Railway logs show whether verification email can actually send.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EmailMailStartupLogger {

    private final EmailService emailService;

    @Value("${email.verification-enabled:true}")
    private boolean verificationEnabled;

    @Value("${email.from-address:noreply@nestbridge.app}")
    private String fromAddress;

    @Value("${app.public-url:http://localhost:8080}")
    private String publicUrl;

    @PostConstruct
    void logMailConfig() {
        boolean sendGridReady = emailService.isConfigured();
        if (!verificationEnabled) {
            log.info(
                    "Email verification DISABLED — new accounts can sign in without inbox mail. from={} publicUrl={}",
                    fromAddress,
                    publicUrl);
            return;
        }
        if (sendGridReady) {
            log.info(
                    "Email verification ENABLED — SendGrid configured. from={} publicUrl={}",
                    fromAddress,
                    publicUrl);
            return;
        }
        log.error(
                "Email verification ENABLED but SENDGRID_API_KEY is missing. "
                        + "New signups will be auto-verified so users are not locked out. "
                        + "Set SENDGRID_API_KEY + a verified EMAIL_FROM on Railway to send real mail. from={} publicUrl={}",
                fromAddress,
                publicUrl);
    }
}
