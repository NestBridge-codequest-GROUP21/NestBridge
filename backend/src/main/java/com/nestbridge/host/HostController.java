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

    @GetMapping("/profile/mine")
    public ResponseEntity<ApiResponse<HostProfileDto>> getMyProfile(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Host profile retrieved", hostService.getMyProfile(userId)));
    }

    @GetMapping("/profile/mine/calendar")
    public ResponseEntity<ApiResponse<java.util.List<HostCalendarDayDto>>> getMyCalendar(
            Authentication authentication,
            @RequestParam int year,
            @RequestParam int month) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Host calendar retrieved", hostService.getMyCalendar(userId, year, month)));
    }

    @GetMapping("/profile/mine/active-booking")
    public ResponseEntity<ApiResponse<HostActiveBookingDto>> getMyActiveBooking(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        HostActiveBookingDto booking = hostService.getMyActiveBooking(userId);
        return ResponseEntity.ok(ApiResponse.success("Active booking retrieved", booking));
    }

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
