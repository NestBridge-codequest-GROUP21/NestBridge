package com.nestbridge.kyc;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/kyc")
@RequiredArgsConstructor
public class KycController {

    private final SmileIdentityService smileIdentityService;

    @PostMapping("/session")
    public ResponseEntity<ApiResponse<KycSessionResponse>> createSession(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "KYC session created",
                smileIdentityService.createSession(userId)));
    }
}
