package com.nestbridge.user;

import com.nestbridge.booking.BookingDto;
import com.nestbridge.booking.BookingService;
import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;
    private final UserRepository userRepository;
    private final BookingService bookingService;
    private final com.nestbridge.notification.DeviceTokenService deviceTokenService;

    @GetMapping("/me/profile")
    public ResponseEntity<ApiResponse<AccountProfileDto>> getMyProfile(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", userProfileService.getMyProfile(userId)));
    }

    @GetMapping("/me/notifications-preference")
    public ResponseEntity<ApiResponse<NotificationsPreferenceResponse>> getNotificationsPreference(
            Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return ResponseEntity.ok(ApiResponse.success(
                "Notifications preference retrieved",
                NotificationsPreferenceResponse.builder()
                        .enabled(user.isNotificationsEnabled())
                        .build()));
    }

    @PutMapping("/me/notifications-preference")
    public ResponseEntity<ApiResponse<NotificationsPreferenceResponse>> updateNotificationsPreference(
            Authentication authentication,
            @RequestBody @jakarta.validation.Valid NotificationsPreferenceRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        boolean enabled = Boolean.TRUE.equals(request.getEnabled());
        user.setNotificationsEnabled(enabled);
        userRepository.save(user);
        if (!enabled) {
            deviceTokenService.removeAllTokensForUser(userId);
        }
        return ResponseEntity.ok(ApiResponse.success(
                "Notifications preference updated",
                NotificationsPreferenceResponse.builder().enabled(enabled).build()));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<AccountProfileDto>> updateMyProfile(
            Authentication authentication,
            @RequestBody AccountProfileUpdateDto update) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userProfileService.updateMyProfile(userId, update)));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<ApiResponse<java.util.List<BookingDto>>> getUserBookings(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID requesterId = (UUID) authentication.getPrincipal();
        if (!requesterId.equals(id)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Not authorized.");
        }
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookingService.getUserBookings(id)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PublicUserDto>> getPublicUser(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        PublicUserDto dto = PublicUserDto.builder()
                .userId(user.getUserId().toString())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .primaryIntent(user.getPrimaryIntent())
                .build();
        return ResponseEntity.ok(ApiResponse.success("User retrieved", dto));
    }
}
