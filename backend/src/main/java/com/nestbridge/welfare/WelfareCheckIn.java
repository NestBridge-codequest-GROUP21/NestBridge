package com.nestbridge.welfare;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "welfare_check_ins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WelfareCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "checkin_id")
    private UUID checkinId;

    @Column(name = "booking_id")
    private UUID bookingId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "scheduled_at")
    private OffsetDateTime scheduledAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> responses;

    @Column(nullable = false)
    private boolean flagged;

    @Column(nullable = false)
    private boolean escalated;

    @Column(name = "escalation_notes")
    private String escalationNotes;
}
