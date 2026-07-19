package com.nestbridge.kyc;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class SmileWebhookController {

    private final SmileIdentityService smileIdentityService;

    @PostMapping("/smile")
    public ResponseEntity<Void> smileCallback(@RequestBody Map<String, Object> payload) {
        smileIdentityService.handleCallback(payload);
        return ResponseEntity.ok().build();
    }
}
