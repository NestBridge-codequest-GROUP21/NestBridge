package com.nestbridge.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProviderSetupRepository extends JpaRepository<ProviderSetup, ProviderSetup.ProviderSetupId> {

    List<ProviderSetup> findByUserId(UUID userId);

    Optional<ProviderSetup> findByUserIdAndTrack(UUID userId, String track);
}
