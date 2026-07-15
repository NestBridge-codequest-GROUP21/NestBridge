package com.nestbridge.welfare;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WelfareCheckInDto {

    private String checkinId;
    private String bookingId;
    private String scheduledAt;
    private String completedAt;
    private boolean flagged;
}
