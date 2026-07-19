package com.nestbridge.host;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HostActiveBookingDto {
    private String guestName;
    private String dateRange;
    private String totalAmount;
}
