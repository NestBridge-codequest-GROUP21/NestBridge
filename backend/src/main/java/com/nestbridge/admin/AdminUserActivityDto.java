package com.nestbridge.admin;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AdminUserActivityDto {
    private UUID userId;
    private List<AdminBookingActivityDto> recentBookings;
    private List<AdminSosActivityDto> recentSosAlerts;
}
