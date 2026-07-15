package com.nestbridge.host;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HostCalendarDayDto {
    private String date;
    private int day;
    private String status;
}
