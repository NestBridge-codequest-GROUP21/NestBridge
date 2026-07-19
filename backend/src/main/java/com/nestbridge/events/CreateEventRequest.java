package com.nestbridge.events;

import lombok.Data;

@Data
public class CreateEventRequest {
    private String title;
    private EventType type;
    private EventOrganizerKind organizerKind;
    private String eventDateLabel;
    private String location;
    private Integer capacity;
    private String description;
}
