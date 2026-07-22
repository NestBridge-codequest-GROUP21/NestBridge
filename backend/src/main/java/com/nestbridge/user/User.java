package com.nestbridge.user;

import com.nestbridge.common.PrimaryIntent;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "primary_intent", length = 30)
    private PrimaryIntent primaryIntent;

    private String nationality;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] languages;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    private String bio;

    /** Longer about-you text shown on public profiles; locked with bio once set. */
    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(name = "identity_locked")
    private boolean identityLocked;

    @Column(name = "is_verified")
    private boolean identityVerified;

    @Column(name = "email_verified")
    private boolean emailVerified;

    @Column(name = "email_verified_at")
    private java.time.OffsetDateTime emailVerifiedAt;

    @Column(name = "phone_verified")
    private boolean phoneVerified;

    @Column(name = "trust_score")
    private BigDecimal trustScore;

    @Column(name = "preferred_language", length = 10)
    private String preferredLanguage;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "is_minor")
    private boolean minor;

    @Column(name = "is_active_exchange_student")
    private boolean activeExchangeStudent;

    @Column(name = "is_staff")
    private boolean staff;

    @Column(name = "is_suspended")
    private boolean suspended;

    @Builder.Default
    @Column(name = "notifications_enabled", nullable = false)
    private boolean notificationsEnabled = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (trustScore == null) {
            trustScore = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
