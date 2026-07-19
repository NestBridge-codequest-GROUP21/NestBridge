package com.nestbridge.user;

import com.nestbridge.common.ProfileStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "provider_setup")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(ProviderSetup.ProviderSetupId.class)
public class ProviderSetup {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Id
    @Column(length = 10)
    private String track;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProfileStatus status;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "steps_completed", columnDefinition = "text[]")
    @Builder.Default
    private List<String> stepsCompleted = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "profile_data", columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> profileData = new HashMap<>();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProviderSetupId implements Serializable {
        private UUID userId;
        private String track;
    }
}
