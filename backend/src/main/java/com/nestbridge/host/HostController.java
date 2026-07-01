package com.nestbridge.host;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/hosts")
@RequiredArgsConstructor
public class HostController {

    private final HostService hostService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HostProfileDto>> getHost(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Host retrieved", hostService.getById(id)));
    }

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<HostProfileDto>> createProfile(
            Authentication authentication,
            @RequestBody HostProfileRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Host profile saved", hostService.upsertProfile(userId, request)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<HostProfileDto>> updateProfile(
            Authentication authentication,
            @RequestBody HostProfileRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Host profile updated", hostService.upsertProfile(userId, request)));
    }
}
