package com.nestbridge.events;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventDto>>> list(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Events", eventService.listEvents(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventDto>> create(
            Authentication authentication,
            @RequestBody CreateEventRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Event created", eventService.createEvent(userId, request)));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<EventDto>> join(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Joined event", eventService.joinEvent(id, userId)));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<EventDto>> leave(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Left event", eventService.leaveEvent(id, userId)));
    }
}
