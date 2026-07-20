package com.nestbridge.notification;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

class EmailVerificationServiceTest {

    @Test
    void hashToken_isStableSha256Hex() {
        String hash1 = EmailVerificationService.hashToken("abc");
        String hash2 = EmailVerificationService.hashToken("abc");
        assertEquals(hash1, hash2);
        assertEquals(64, hash1.length());
        assertNotEquals(hash1, EmailVerificationService.hashToken("abcd"));
    }
}
