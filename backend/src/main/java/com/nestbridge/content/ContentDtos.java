package com.nestbridge.content;

import lombok.Builder;

import java.util.List;

@Builder
record PhraseDto(
        String id,
        String emoji,
        String phrase,
        String translation,
        boolean hasAudio,
        String audioUrl) {}

@Builder
record TopicDto(String id, String emoji, String title, String description) {}

@Builder
record TransportRouteDto(
        String id,
        String name,
        String description,
        String fareLabel,
        String estimatedPrice) {}

@Builder
record TransportTabDto(String id, String label, List<TransportRouteDto> routes) {}

@Builder
record TouristSiteDto(
        String id,
        String siteKey,
        String name,
        String city,
        String description,
        String openingHours,
        String admission) {}

@Builder
record ChecklistItemDto(String id, String itemKey, String label) {}

@Builder
record EmergencyContactDto(String label, String number) {}

@Builder
record MapLandmarkDto(
        String id,
        String name,
        double topPercent,
        double leftPercent,
        Double lat,
        Double lng) {}

@Builder
record VideoResourceDto(
        String id,
        String videoKey,
        String title,
        String description,
        String category,
        String youtubeId,
        String thumbnailUrl,
        String city) {}
