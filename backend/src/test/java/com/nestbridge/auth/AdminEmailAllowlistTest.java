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
    void blankEnv_usesBuiltInDefaultEmails() {
        var allowlist = new AdminEmailAllowlist("");
        assertTrue(allowlist.contains("bsbhackman@gmail.com"));
        assertTrue(allowlist.contains("AbdulsamedTaslima@gmail.com"));
        assertTrue(allowlist.contains("angelonwe54@gmail.com"));
        assertFalse(allowlist.contains("student@example.com"));
        assertEquals(3, allowlist.snapshot().size());
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
