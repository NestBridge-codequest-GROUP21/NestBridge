package com.nestbridge.welfare;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SosEventRepository extends JpaRepository<SosEvent, UUID> {

    List<SosEvent> findByUserIdOrderByTriggeredAtDesc(UUID userId, Pageable pageable);
}
