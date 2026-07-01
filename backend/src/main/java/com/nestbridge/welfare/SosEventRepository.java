package com.nestbridge.welfare;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SosEventRepository extends JpaRepository<SosEvent, UUID> {
}
