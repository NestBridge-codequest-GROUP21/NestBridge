package com.nestbridge.guide;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GuideCalendarDayDto {
    private String date;
    private int day;
    private List<String> shifts;
}
