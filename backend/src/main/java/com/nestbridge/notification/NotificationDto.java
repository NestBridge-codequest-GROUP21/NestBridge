package com.nestbridge.notification;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Map;

@Data
@Builder
public class NotificationDto {

    private String id;
    private String type;
    private String title;
    private String body;
    private boolean read;
    private String createdAt;
    private Map<String, Object> data;
}
