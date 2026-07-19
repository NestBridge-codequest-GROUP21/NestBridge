package com.nestbridge.events;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventAttendeeRepository attendeeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<EventDto> listEvents(UUID currentUserId) {
        List<Event> events = eventRepository.findAllByOrderByCreatedAtDesc();
        if (events.isEmpty()) {
            return List.of();
        }

        List<UUID> eventIds = events.stream().map(Event::getEventId).collect(Collectors.toList());
        List<EventAttendee> attendees = attendeeRepository.findByEventIdIn(eventIds);

        Map<UUID, Integer> countByEvent = new HashMap<>();
        Set<UUID> joinedByCurrent = attendees.stream()
                .filter(a -> a.getUserId().equals(currentUserId))
                .map(EventAttendee::getEventId)
                .collect(Collectors.toSet());
        for (EventAttendee a : attendees) {
            countByEvent.merge(a.getEventId(), 1, Integer::sum);
        }

        return events.stream()
                .map(e -> toDto(e, countByEvent.getOrDefault(e.getEventId(), 0),
                        joinedByCurrent.contains(e.getEventId()), currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public EventDto createEvent(UUID hostId, CreateEventRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Give your event a title.");
        }
        if (request.getEventDateLabel() == null || request.getEventDateLabel().isBlank()) {
            throw new IllegalArgumentException("Add a date and time for your event.");
        }
        if (request.getLocation() == null || request.getLocation().isBlank()) {
            throw new IllegalArgumentException("Add a location.");
        }

        int capacity = request.getCapacity() != null && request.getCapacity() > 0
                ? request.getCapacity()
                : 10;

        Event event = Event.builder()
                .hostId(hostId)
                .title(request.getTitle().trim())
                .type(request.getType() != null ? request.getType() : EventType.MEETUP)
                .organizerKind(request.getOrganizerKind() != null
                        ? request.getOrganizerKind()
                        : EventOrganizerKind.STUDENT)
                .eventDateLabel(request.getEventDateLabel().trim())
                .location(request.getLocation().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : "")
                .capacity(capacity)
                .build();

        event = eventRepository.save(event);

        // The host is automatically counted as attending their own event.
        attendeeRepository.save(EventAttendee.builder()
                .eventId(event.getEventId())
                .userId(hostId)
                .build());

        return toDto(event, 1, true, hostId);
    }

    @Transactional
    public EventDto joinEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found."));

        boolean already = attendeeRepository.existsByEventIdAndUserId(eventId, userId);
        if (!already) {
            long count = attendeeRepository.countByEventId(eventId);
            if (count >= event.getCapacity()) {
                throw new IllegalStateException("This event is full.");
            }
            attendeeRepository.save(EventAttendee.builder()
                    .eventId(eventId)
                    .userId(userId)
                    .build());
        }

        int count = (int) attendeeRepository.countByEventId(eventId);
        return toDto(event, count, true, userId);
    }

    @Transactional
    public EventDto leaveEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found."));

        attendeeRepository.deleteByEventIdAndUserId(eventId, userId);

        int count = (int) attendeeRepository.countByEventId(eventId);
        return toDto(event, count, false, userId);
    }

    private EventDto toDto(Event e, int attendeeCount, boolean joined, UUID currentUserId) {
        User host = userRepository.findById(e.getHostId()).orElse(null);
        String hostName = host != null ? host.getFullName() : "NestBridge";
        return EventDto.builder()
                .eventId(e.getEventId())
                .hostId(e.getHostId())
                .title(e.getTitle())
                .type(e.getType())
                .organizerKind(e.getOrganizerKind())
                .organizerName(hostName)
                .organizerInitials(initials(hostName))
                .eventDateLabel(e.getEventDateLabel())
                .location(e.getLocation())
                .description(e.getDescription())
                .capacity(e.getCapacity())
                .attendeeCount(attendeeCount)
                .spotsLeft(Math.max(0, e.getCapacity() - attendeeCount))
                .joined(joined)
                .hostedByYou(currentUserId != null && currentUserId.equals(e.getHostId()))
                .createdAt(e.getCreatedAt())
                .build();
    }

    private String initials(String name) {
        if (name == null || name.isBlank()) return "??";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) return ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }
}
