package com.nestbridge.guide;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/guides")
@RequiredArgsConstructor
public class GuideController {

    private final GuideService guideService;

    @GetMapping("/profile/mine")
    public ResponseEntity<ApiResponse<GuideProfileDto>> getMyProfile(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Guide profile retrieved", guideService.getMyProfile(userId)));
    }

    @GetMapping("/profile/mine/calendar")
    public ResponseEntity<ApiResponse<java.util.List<GuideCalendarDayDto>>> getMyCalendar(
            Authentication authentication,
            @RequestParam int year,
            @RequestParam int month) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Guide calendar retrieved", guideService.getMyCalendar(userId, year, month)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GuideProfileDto>> getGuide(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Guide retrieved", guideService.getById(id)));
    }

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<GuideProfileDto>> createProfile(
            Authentication authentication,
            @RequestBody GuideProfileRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Guide profile saved", guideService.upsertProfile(userId, request)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<GuideProfileDto>> updateProfile(
            Authentication authentication,
            @RequestBody GuideProfileRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Guide profile updated", guideService.upsertProfile(userId, request)));
    }
}
