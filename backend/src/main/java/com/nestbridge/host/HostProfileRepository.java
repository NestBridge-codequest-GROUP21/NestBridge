package com.nestbridge.host;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HostProfileRepository extends JpaRepository<HostProfile, UUID> {

    Optional<HostProfile> findByUserId(UUID userId);

    List<HostProfile> findByCityIgnoreCaseAndActiveTrue(String city);

    List<HostProfile> findByActiveTrue();

    long countByActiveTrue();

    long countByActiveFalse();
}
