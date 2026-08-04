package com.nestbridge.auth;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AdminEmailAllowlistTest {

    @Test
    void parse_splitsTrimsAndLowercases() {
        var emails = AdminEmailAllowlist.parse(" You@School.Edu , teammate@gmail.com,, ");
        assertEquals(2, emails.size());
        assertTrue(emails.contains("you@school.edu"));
        assertTrue(emails.contains("teammate@gmail.com"));
    }

    @Test
    void parse_emptyOrBlank_returnsEmpty() {
        assertTrue(AdminEmailAllowlist.parse(null).isEmpty());
        assertTrue(AdminEmailAllowlist.parse("").isEmpty());
        assertTrue(AdminEmailAllowlist.parse("   ").isEmpty());
    }

    @Test
    void blankEnv_usesNoBuiltInDefault() {
        var allowlist = new AdminEmailAllowlist("");
        assertTrue(allowlist.snapshot().isEmpty());
        assertFalse(allowlist.contains("bsbhackman@gmail.com"));
        assertFalse(allowlist.contains("admin@nestbridge.app"));
    }

    @Test
    void contains_matchesAllowlistedEmail() {
        var allowlist = new AdminEmailAllowlist("admin@nestbridge.app, ops@example.com");
        assertTrue(allowlist.contains("Admin@NestBridge.app"));
        assertTrue(allowlist.contains(" ops@example.com "));
        assertFalse(allowlist.contains("student@example.com"));
        assertFalse(allowlist.contains("bsbhackman@gmail.com"));
        assertFalse(allowlist.contains(null));
    }
}
