package com.nestbridge.content;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final JdbcTemplate jdbc;

    private String normalizeCity(String city) {
        if (city == null || city.isBlank()) {
            return "Accra";
        }
        return city.split(",")[0].trim();
    }

    public List<PhraseDto> getPhrases(String city) {
        String c = normalizeCity(city);
        return jdbc.query(
                """
                SELECT phrase_id::text, emoji, phrase, translation, audio_url
                FROM cultural_phrases
                WHERE is_active = true AND LOWER(city) = LOWER(?)
                ORDER BY sort_order
                """,
                (rs, rowNum) -> PhraseDto.builder()
                        .id(rs.getString(1))
                        .emoji(rs.getString(2))
                        .phrase(rs.getString(3))
                        .translation(rs.getString(4))
                        .audioUrl(rs.getString(5))
                        .hasAudio(rs.getString(5) != null && !rs.getString(5).isBlank())
                        .build(),
                c);
    }

    public List<TopicDto> getTopics(String city) {
        String c = normalizeCity(city);
        return jdbc.query(
                """
                SELECT topic_id::text, emoji, title, description
                FROM cultural_topics
                WHERE is_active = true AND LOWER(city) = LOWER(?)
                ORDER BY sort_order
                """,
                (rs, rowNum) -> TopicDto.builder()
                        .id(rs.getString(1))
                        .emoji(rs.getString(2))
                        .title(rs.getString(3))
                        .description(rs.getString(4))
                        .build(),
                c);
    }

    public List<TransportTabDto> getTransport(String city) {
        String c = normalizeCity(city);
        List<Map<String, Object>> tabs = jdbc.queryForList(
                """
                SELECT tab_id::text AS tab_id, tab_key, label
                FROM transport_tabs
                WHERE is_active = true AND LOWER(city) = LOWER(?)
                ORDER BY sort_order
                """,
                c);
        List<TransportTabDto> result = new ArrayList<>();
        for (Map<String, Object> tab : tabs) {
            UUID tabId = UUID.fromString((String) tab.get("tab_id"));
            List<TransportRouteDto> routes = jdbc.query(
                    """
                    SELECT route_id::text, route_key, name, description, fare_label, estimated_price
                    FROM transport_routes
                    WHERE tab_id = ?
                    ORDER BY sort_order
                    """,
                    (rs, rowNum) -> TransportRouteDto.builder()
                            .id(rs.getString(1))
                            .name(rs.getString(3))
                            .description(rs.getString(4))
                            .fareLabel(rs.getString(5))
                            .estimatedPrice(rs.getString(6))
                            .build(),
                    tabId);
            result.add(TransportTabDto.builder()
                    .id((String) tab.get("tab_key"))
                    .label((String) tab.get("label"))
                    .routes(routes)
                    .build());
        }
        return result;
    }

    public List<TouristSiteDto> getSites(String city) {
        String c = normalizeCity(city);
        return jdbc.query(
                """
                SELECT site_id::text, site_key, name, city, description, opening_hours, admission
                FROM tourist_sites
                WHERE is_active = true AND (LOWER(city) = LOWER(?) OR ? = 'Accra')
                ORDER BY sort_order
                """,
                (rs, rowNum) -> TouristSiteDto.builder()
                        .id(rs.getString(1))
                        .siteKey(rs.getString(2))
                        .name(rs.getString(3))
                        .city(rs.getString(4))
                        .description(rs.getString(5))
                        .openingHours(rs.getString(6))
                        .admission(rs.getString(7))
                        .build(),
                c, c);
    }

    public TouristSiteDto getSite(String siteKey) {
        return jdbc.query(
                """
                SELECT site_id::text, site_key, name, city, description, opening_hours, admission
                FROM tourist_sites
                WHERE is_active = true AND site_key = ?
                """,
                rs -> {
                    if (!rs.next()) {
                        throw new IllegalArgumentException("Site not found.");
                    }
                    return TouristSiteDto.builder()
                            .id(rs.getString(1))
                            .siteKey(rs.getString(2))
                            .name(rs.getString(3))
                            .city(rs.getString(4))
                            .description(rs.getString(5))
                            .openingHours(rs.getString(6))
                            .admission(rs.getString(7))
                            .build();
                },
                siteKey);
    }

    public List<ChecklistItemDto> getChecklist(String city) {
        String c = normalizeCity(city);
        return jdbc.query(
                """
                SELECT item_id::text, item_key, label
                FROM prep_checklist_items
                WHERE is_active = true AND LOWER(city) = LOWER(?)
                ORDER BY sort_order
                """,
                (rs, rowNum) -> ChecklistItemDto.builder()
                        .id(rs.getString(1))
                        .itemKey(rs.getString(2))
                        .label(rs.getString(3))
                        .build(),
                c);
    }

    public List<EmergencyContactDto> getEmergencyContacts() {
        return jdbc.query(
                """
                SELECT label, phone_number
                FROM emergency_contacts
                WHERE is_active = true
                ORDER BY sort_order
                """,
                (rs, rowNum) -> EmergencyContactDto.builder()
                        .label(rs.getString(1))
                        .number(rs.getString(2))
                        .build());
    }

    public List<MapLandmarkDto> getMapLandmarks(String city) {
        String c = normalizeCity(city);
        return jdbc.query(
                """
                SELECT landmark_id::text, name, top_percent, left_percent, lat, lng
                FROM offline_map_landmarks
                WHERE is_active = true AND LOWER(city) = LOWER(?)
                ORDER BY sort_order
                """,
                (rs, rowNum) -> MapLandmarkDto.builder()
                        .id(rs.getString(1))
                        .name(rs.getString(2))
                        .topPercent(rs.getBigDecimal(3).doubleValue())
                        .leftPercent(rs.getBigDecimal(4).doubleValue())
                        .lat(rs.getBigDecimal(5) != null ? rs.getBigDecimal(5).doubleValue() : null)
                        .lng(rs.getBigDecimal(6) != null ? rs.getBigDecimal(6).doubleValue() : null)
                        .build(),
                c);
    }

    public List<VideoResourceDto> getVideos(String city, String category) {
        String c = normalizeCity(city);
        if (category != null && !category.isBlank()) {
            return jdbc.query(
                    """
                    SELECT video_id::text, video_key, title, description, category, youtube_id, thumbnail_url, city
                    FROM video_resources
                    WHERE is_active = true AND LOWER(city) = LOWER(?) AND LOWER(category) = LOWER(?)
                    ORDER BY sort_order
                    """,
                    (rs, rowNum) -> mapVideo(rs),
                    c, category);
        }
        return jdbc.query(
                """
                SELECT video_id::text, video_key, title, description, category, youtube_id, thumbnail_url, city
                FROM video_resources
                WHERE is_active = true AND LOWER(city) = LOWER(?)
                ORDER BY sort_order
                """,
                (rs, rowNum) -> mapVideo(rs),
                c);
    }

    public VideoResourceDto getVideo(String videoKey) {
        return jdbc.query(
                """
                SELECT video_id::text, video_key, title, description, category, youtube_id, thumbnail_url, city
                FROM video_resources
                WHERE is_active = true AND video_key = ?
                """,
                rs -> {
                    if (!rs.next()) {
                        throw new IllegalArgumentException("Video not found.");
                    }
                    return mapVideo(rs);
                },
                videoKey);
    }

    private VideoResourceDto mapVideo(java.sql.ResultSet rs) throws java.sql.SQLException {
        return VideoResourceDto.builder()
                .id(rs.getString(1))
                .videoKey(rs.getString(2))
                .title(rs.getString(3))
                .description(rs.getString(4))
                .category(rs.getString(5))
                .youtubeId(rs.getString(6))
                .thumbnailUrl(rs.getString(7))
                .city(rs.getString(8))
                .build();
    }
}
