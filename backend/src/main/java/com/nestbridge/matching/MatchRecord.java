package com.nestbridge.matching;

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
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "match_id")
    private UUID matchId;

    @Column(name = "seeker_id")
    private UUID seekerId;

    @Column(name = "target_id")
    private UUID targetId;

    @Column(name = "target_type")
    private String targetType;

    @Column(name = "compatibility_score")
    private BigDecimal compatibilityScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "score_breakdown", columnDefinition = "jsonb")
    private Map<String, Object> scoreBreakdown;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "match_reasons", columnDefinition = "text[]")
    private List<String> matchReasons;

    private String status;

    @Column(name = "initiated_at")
    private LocalDateTime initiatedAt;

    @PrePersist
    void prePersist() {
        initiatedAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }
}
