package com.nestbridge.admin;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminOverviewDto {
    private long totalUsers;
    private long studentCount;
    private long touristCount;
    private long hostCount;
    private long guideCount;
    private long staffCount;
    private long suspendedCount;
    private long unverifiedIdentityCount;
    private long pendingKycCount;
    private long unverifiedEmailCount;
    private long activeHostListings;
    private long activeGuideListings;
    private long hiddenHostListings;
    private long hiddenGuideListings;
    private long pendingBookings;
    private long confirmedBookings;
    private long sosLast24Hours;
    private long sosLast7Days;
    private List<AdminBookingActivityDto> recentBookings;
    private List<AdminSosActivityDto> recentSosAlerts;
}
