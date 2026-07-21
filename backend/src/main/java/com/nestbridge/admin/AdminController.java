package com.nestbridge.admin;

import com.nestbridge.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<List<AdminUserSummaryDto>>> searchUsers(
            Authentication authentication,
            @RequestParam String query) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Users retrieved",
                adminService.searchUsers(actorId, query)));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<AdminUserDetailDto>> getUser(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "User retrieved",
                adminService.getUser(actorId, id)));
    }

    @PatchMapping("/users/{id}/suspend")
    public ResponseEntity<ApiResponse<AdminUserDetailDto>> suspendUser(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody SuspendUserRequest request) {
        UUID actorId = (UUID) authentication.getPrincipal();
        String message = Boolean.TRUE.equals(request.getSuspended()) ? "User suspended" : "User unsuspended";
        return ResponseEntity.ok(ApiResponse.success(
                message,
                adminService.setSuspended(actorId, id, request.getSuspended())));
    }

    @PatchMapping("/users/{id}/kyc-status")
    public ResponseEntity<ApiResponse<AdminUserDetailDto>> updateKycStatus(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody KycStatusRequest request) {
        UUID actorId = (UUID) authentication.getPrincipal();
        String message = Boolean.TRUE.equals(request.getIdentityVerified())
                ? "KYC marked verified"
                : "KYC verification cleared";
        return ResponseEntity.ok(ApiResponse.success(
                message,
                adminService.setKycStatus(actorId, id, request.getIdentityVerified())));
    }

    @PatchMapping("/users/{id}/email-verified")
    public ResponseEntity<ApiResponse<AdminUserDetailDto>> updateEmailVerified(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody EmailVerifiedRequest request) {
        UUID actorId = (UUID) authentication.getPrincipal();
        String message = Boolean.TRUE.equals(request.getEmailVerified())
                ? "Email marked verified"
                : "Email verification cleared";
        return ResponseEntity.ok(ApiResponse.success(
                message,
                adminService.setEmailVerified(actorId, id, request.getEmailVerified())));
    }

    @PatchMapping("/users/{id}/staff-status")
    public ResponseEntity<ApiResponse<AdminUserDetailDto>> updateStaffStatus(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody StaffStatusRequest request) {
        UUID actorId = (UUID) authentication.getPrincipal();
        String message = Boolean.TRUE.equals(request.getIsStaff())
                ? "Staff access granted"
                : "Staff access revoked";
        return ResponseEntity.ok(ApiResponse.success(
                message,
                adminService.setStaffStatus(actorId, id, request.getIsStaff())));
    }

    @GetMapping("/users/{id}/activity")
    public ResponseEntity<ApiResponse<AdminUserActivityDto>> getUserActivity(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "User activity retrieved",
                adminService.getUserActivity(actorId, id)));
    }

    @PatchMapping("/listings/{id}/hide")
    public ResponseEntity<ApiResponse<AdminListingHideResultDto>> hideListing(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Listing hidden",
                adminService.hideListing(actorId, id)));
    }
}
