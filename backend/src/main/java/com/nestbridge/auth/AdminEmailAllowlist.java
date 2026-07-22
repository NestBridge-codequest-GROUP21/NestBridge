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
 * Pre-approved emails that receive {@code is_staff=true} at registration.
 * Configure via {@code ADMIN_EMAIL_ALLOWLIST} (comma-separated), e.g. on Railway.
 * When unset/blank, falls back to the built-in group allowlist.
 */
@Component
@Slf4j
public class AdminEmailAllowlist {

    /**
     * Used when {@code ADMIN_EMAIL_ALLOWLIST} is missing or empty
     * (e.g. Railway not configured yet).
     */
    /** Group 21 staff — personal Gmails get is_staff on register/login. */
    static final String DEFAULT_ALLOWLIST =
            "bsbhackman@gmail.com,"
                    + "abigailadusei17@gmail.com,"
                    + "angelonwe54@gmail.com,"
                    + "sirinaabbas2@gmail.com,"
                    + "abdulsamedtaslima@gmail.com";

    private final Set<String> emails;

    public AdminEmailAllowlist(@Value("${admin.email-allowlist:}") String rawAllowlist) {
        Set<String> parsed = parse(rawAllowlist);
        boolean usedDefault = parsed.isEmpty();
        this.emails = usedDefault ? parse(DEFAULT_ALLOWLIST) : parsed;
        if (usedDefault) {
            log.info(
                    "Admin email allowlist using built-in default ({} addresses) — set ADMIN_EMAIL_ALLOWLIST to override",
                    emails.size());
        } else {
            log.info("Admin email allowlist loaded from ADMIN_EMAIL_ALLOWLIST ({} address{})",
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
