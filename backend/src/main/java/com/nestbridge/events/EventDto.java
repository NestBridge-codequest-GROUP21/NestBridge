package com.nestbridge.events;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class EventDto {
    private UUID eventId;
    private UUID hostId;
    private String title;
    private EventType type;
    private EventOrganizerKind organizerKind;
    private String organizerName;
    private String organizerInitials;
    private String eventDateLabel;
    private String location;
    private String description;
    private int capacity;
    private int attendeeCount;
    private int spotsLeft;
    private boolean joined;
    private boolean hostedByYou;
    private LocalDateTime createdAt;
}
