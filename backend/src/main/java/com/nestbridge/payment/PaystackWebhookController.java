package com.nestbridge.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class PaystackWebhookController {

    private final PaystackService paystackService;

    @PostMapping(value = "/paystack", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> paystack(
            @RequestBody String rawBody,
            @RequestHeader(value = "x-paystack-signature", required = false) String signature) {
        paystackService.handleWebhook(rawBody, signature);
        return ResponseEntity.ok().build();
    }
}
