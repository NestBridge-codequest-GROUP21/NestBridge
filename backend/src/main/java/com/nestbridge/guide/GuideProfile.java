package com.nestbridge.guide;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "guide_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuideProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "guide_id")
    private UUID guideId;

    @Column(name = "user_id")
    private UUID userId;

    private String city;
    private String country;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "service_types", columnDefinition = "text[]")
    private List<String> serviceTypes;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "languages_offered", columnDefinition = "text[]")
    private List<String> languagesOffered;

    @Column(name = "price_per_session")
    private BigDecimal pricePerSession;

    @Column(name = "session_duration_hours")
    private BigDecimal sessionDurationHours;

    @Column(name = "bio_extended")
    private String bioExtended;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> photos;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "availability_schedule", columnDefinition = "jsonb")
    private Map<String, Object> availabilitySchedule;

    @Column(name = "is_active")
    private boolean active;

    @Column(name = "experience_verified")
    private boolean experienceVerified;

    @Column(name = "review_count")
    private int reviewCount;

    @Column(name = "average_rating")
    private BigDecimal averageRating;

    private BigDecimal lat;
    private BigDecimal lng;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
