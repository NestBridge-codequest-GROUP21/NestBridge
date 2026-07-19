package com.nestbridge.media;

import com.nestbridge.common.ApiResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/profile-photo/upload-url")
    public ResponseEntity<ApiResponse<PhotoUploadUrlResponse>> profilePhotoUploadUrl(
            Authentication authentication,
            @RequestBody(required = false) PhotoUploadRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        String contentType = request != null ? request.getContentType() : "image/jpeg";
        return ResponseEntity.ok(ApiResponse.success(
                "Upload URL created",
                mediaService.createProfilePhotoUploadUrl(userId, contentType)));
    }
}
