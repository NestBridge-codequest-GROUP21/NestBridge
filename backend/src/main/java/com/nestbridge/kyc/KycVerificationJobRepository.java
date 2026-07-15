package com.nestbridge.kyc;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface KycVerificationJobRepository extends JpaRepository<KycVerificationJob, UUID> {

    Optional<KycVerificationJob> findTopByUserIdOrderByCreatedAtDesc(UUID userId);
}
