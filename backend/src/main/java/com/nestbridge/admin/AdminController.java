package com.nestbridge.admin;

import com.nestbridge.common.ApiResponse;
import com.nestbridge.common.PrimaryIntent;
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

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AdminOverviewDto>> getOverview(Authentication authentication) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Overview retrieved",
                adminService.getOverview(actorId)));
    }

    @GetMapping("/listings")
    public ResponseEntity<ApiResponse<AdminPageDto<AdminListingModerationDto>>> listListings(
            Authentication authentication,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean hidden,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Listings retrieved",
                adminService.listListings(actorId, type, hidden, page, limit)));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<AdminPageDto<AdminUserSummaryDto>>> listUsers(
            Authentication authentication,
            @RequestParam(required = false) PrimaryIntent intent,
            @RequestParam(required = false) Boolean staff,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Users retrieved",
                adminService.listUsers(actorId, intent, staff, query, page, limit)));
    }

    @GetMapping("/kyc/pending")
    public ResponseEntity<ApiResponse<List<AdminPendingKycDto>>> listPendingKyc(
            Authentication authentication,
            @RequestParam(required = false) Integer limit) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Pending KYC retrieved",
                adminService.listPendingKyc(actorId, limit)));
    }

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
                : "KYC rejected";
        return ResponseEntity.ok(ApiResponse.success(
                message,
                adminService.setKycStatus(
                        actorId,
                        id,
                        Boolean.TRUE.equals(request.getIdentityVerified()),
                        request.getReason())));
    }

    @PostMapping("/users/{id}/unlock-identity")
    public ResponseEntity<ApiResponse<AdminUserDetailDto>> unlockIdentity(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Identity fields unlocked",
                adminService.unlockIdentity(actorId, id)));
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

    @PatchMapping("/listings/{id}/visibility")
    public ResponseEntity<ApiResponse<AdminListingHideResultDto>> setListingVisibility(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody ListingVisibilityRequest request) {
        UUID actorId = (UUID) authentication.getPrincipal();
        boolean hidden = Boolean.TRUE.equals(request.getHidden());
        return ResponseEntity.ok(ApiResponse.success(
                hidden ? "Listing hidden" : "Listing restored",
                adminService.setListingVisibility(actorId, id, hidden)));
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

    @PostMapping("/audit")
    public ResponseEntity<ApiResponse<StaffAuditResultDto>> recordAudit(
            Authentication authentication,
            @Valid @RequestBody StaffAuditRequest request) {
        UUID actorId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Audit recorded",
                adminService.recordAudit(actorId, request.getAction(), request.getDetail())));
    }
}
