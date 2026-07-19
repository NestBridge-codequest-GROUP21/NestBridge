package com.nestbridge.welfare;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sos_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SosEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "sos_id")
    private UUID sosId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;

    @Column(name = "location_lat")
    private BigDecimal locationLat;

    @Column(name = "location_lng")
    private BigDecimal locationLng;

    @Column(name = "contacted_emergency")
    private boolean contactedEmergency;

    @Column(name = "contacted_support")
    private boolean contactedSupport;

    @PrePersist
    void prePersist() {
        triggeredAt = LocalDateTime.now();
    }
}
