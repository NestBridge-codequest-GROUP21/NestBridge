package com.nestbridge.kyc;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class SmileWebhookController {

    private final SmileIdentityService smileIdentityService;

    @PostMapping(value = "/smile", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> smileCallback(
            @RequestBody String rawBody,
            @RequestHeader(value = "x-smile-signature", required = false) String signature) {
        smileIdentityService.handleCallback(rawBody, signature);
        return ResponseEntity.ok().build();
    }
}
