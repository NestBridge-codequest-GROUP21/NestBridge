package com.nestbridge.kyc;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/kyc")
@RequiredArgsConstructor
public class KycController {

    private final SmileIdentityService smileIdentityService;
    private final KycStatusService kycStatusService;

    /**
     * Start verification. Manual (Smile off) path requires a document photo part named {@code document}.
     */
    @PostMapping(value = "/session", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<KycSessionResponse>> createSessionWithDocument(
            Authentication authentication,
            @RequestPart("document") MultipartFile document) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "KYC session created",
                smileIdentityService.createSession(userId, document)));
    }

    /** Smile / legacy JSON start (no document). Manual mode rejects without a document. */
    @PostMapping(value = "/session", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<KycSessionResponse>> createSessionJson(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "KYC session created",
                smileIdentityService.createSession(userId, null)));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<KycStatusResponse>> getStatus(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "KYC status retrieved",
                kycStatusService.getStatus(userId)));
    }
}
