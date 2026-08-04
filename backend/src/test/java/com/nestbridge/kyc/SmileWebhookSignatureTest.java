package com.nestbridge.kyc;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SmileWebhookSignatureTest {

    private SmileIdentityService service;

    @BeforeEach
    void setUp() {
        service = new SmileIdentityService(null, null, null, null);
        ReflectionTestUtils.setField(service, "apiKey", "test-smile-api-key");
        ReflectionTestUtils.setField(service, "smileEnabled", true);
    }

    @Test
    void validHexSignature_isAccepted() throws Exception {
        String body = "{\"user_id\":\"11111111-1111-1111-1111-111111111111\",\"ResultCode\":\"0810\"}";
        String signature = hmacHex(body, "test-smile-api-key");
        assertTrue(service.verifyWebhookSignature(body, signature));
    }

    @Test
    void missingOrWrongSignature_isRejected() throws Exception {
        String body = "{\"user_id\":\"11111111-1111-1111-1111-111111111111\"}";
        assertFalse(service.verifyWebhookSignature(body, null));
        assertFalse(service.verifyWebhookSignature(body, ""));
        assertFalse(service.verifyWebhookSignature(body, "deadbeef"));
        String other = hmacHex(body, "wrong-key");
        assertFalse(service.verifyWebhookSignature(body, other));
    }

    private static String hmacHex(String payload, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    }
}
