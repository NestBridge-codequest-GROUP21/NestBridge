package com.nestbridge.kyc;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface KycVerificationJobRepository extends JpaRepository<KycVerificationJob, UUID> {

    Optional<KycVerificationJob> findTopByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<KycVerificationJob> findTopByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, String status);

    Optional<KycVerificationJob> findByExternalJobId(String externalJobId);

    List<KycVerificationJob> findByStatusOrderByCreatedAtAsc(String status, Pageable pageable);

    long countByStatus(String status);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE KycVerificationJob j
            SET j.status = 'APPROVED', j.completedAt = :completedAt, j.rejectionReason = null
            WHERE j.jobId = :jobId AND j.status = 'PENDING'
            """)
    int approveIfPending(
            @Param("jobId") UUID jobId,
            @Param("completedAt") OffsetDateTime completedAt);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE KycVerificationJob j
            SET j.status = 'REJECTED', j.completedAt = :completedAt, j.rejectionReason = :reason
            WHERE j.jobId = :jobId AND j.status = 'PENDING'
            """)
    int rejectIfPending(
            @Param("jobId") UUID jobId,
            @Param("reason") String reason,
            @Param("completedAt") OffsetDateTime completedAt);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE KycVerificationJob j
            SET j.status = 'EXPIRED', j.completedAt = :completedAt
            WHERE j.status = 'PENDING' AND j.createdAt < :cutoff
            """)
    int expireStalePending(
            @Param("cutoff") OffsetDateTime cutoff,
            @Param("completedAt") OffsetDateTime completedAt);
}
