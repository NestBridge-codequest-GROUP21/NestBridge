package com.nestbridge.host;

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
@Table(name = "host_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "host_id")
    private UUID hostId;

    @Column(name = "user_id")
    private UUID userId;

    private String address;
    private String city;
    private String country;

    private BigDecimal lat;
    private BigDecimal lng;

    @Column(name = "room_type")
    private String roomType;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Column(name = "price_per_night")
    private BigDecimal pricePerNight;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> amenities;

    @Column(name = "house_rules")
    private String houseRules;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "diet_offered", columnDefinition = "text[]")
    private List<String> dietOffered;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "religion_friendly", columnDefinition = "text[]")
    private List<String> religionFriendly;

    @Column(name = "cancellation_policy")
    private String cancellationPolicy;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "availability_calendar", columnDefinition = "jsonb")
    private Map<String, Object> availabilityCalendar;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> photos;

    @Column(name = "accepts_minors")
    private boolean acceptsMinors;

    @Column(name = "is_active")
    private boolean active;

    @Column(name = "review_count")
    private int reviewCount;

    @Column(name = "average_rating")
    private BigDecimal averageRating;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
