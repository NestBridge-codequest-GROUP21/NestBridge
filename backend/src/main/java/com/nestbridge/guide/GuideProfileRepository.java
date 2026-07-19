package com.nestbridge.guide;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GuideProfileRepository extends JpaRepository<GuideProfile, UUID> {

    Optional<GuideProfile> findByUserId(UUID userId);

    List<GuideProfile> findByCityIgnoreCaseAndActiveTrue(String city);

    List<GuideProfile> findByActiveTrue();
}
