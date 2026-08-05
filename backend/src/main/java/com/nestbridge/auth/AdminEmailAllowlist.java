package com.nestbridge.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Pre-approved emails that receive {@code is_staff=true} at registration (and on login heal).
 * Configure via {@code ADMIN_EMAIL_ALLOWLIST}. Prod/dev properties default to Group 21 emails
 * when the env var is unset.
 */
@Component
@Slf4j
public class AdminEmailAllowlist {

    private final Set<String> emails;

    public AdminEmailAllowlist(@Value("${admin.email-allowlist:}") String rawAllowlist) {
        this.emails = parse(rawAllowlist);
        if (emails.isEmpty()) {
            log.warn(
                    "ADMIN_EMAIL_ALLOWLIST is empty — no emails will receive staff on registration. "
                            + "Set ADMIN_EMAIL_ALLOWLIST on the host environment.");
        } else {
            log.info(
                    "Admin email allowlist loaded from ADMIN_EMAIL_ALLOWLIST ({} address{})",
                    emails.size(),
                    emails.size() == 1 ? "" : "es");
        }
    }

    public boolean contains(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        return emails.contains(email.trim().toLowerCase(Locale.ROOT));
    }

    public Set<String> snapshot() {
        return Collections.unmodifiableSet(emails);
    }

    static Set<String> parse(String rawAllowlist) {
        if (rawAllowlist == null || rawAllowlist.isBlank()) {
            return Set.of();
        }
        return Arrays.stream(rawAllowlist.split(","))
                .map(String::trim)
                .filter(part -> !part.isEmpty())
                .map(part -> part.toLowerCase(Locale.ROOT))
                .collect(Collectors.toUnmodifiableSet());
    }
}
