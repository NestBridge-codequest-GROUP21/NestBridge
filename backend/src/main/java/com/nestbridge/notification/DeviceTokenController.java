package com.nestbridge.notification;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class DeviceTokenController {

    private final DeviceTokenService deviceTokenService;

    @PostMapping("/device-tokens")
    public ResponseEntity<ApiResponse<Void>> registerDeviceToken(
            Authentication authentication,
            @RequestBody RegisterDeviceTokenRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        deviceTokenService.registerToken(userId, request.getExpoPushToken(), request.getPlatform());
        return ResponseEntity.ok(ApiResponse.success("Device token registered", null));
    }
}
