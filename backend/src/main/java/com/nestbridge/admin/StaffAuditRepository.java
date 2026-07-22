package com.nestbridge.admin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StaffAuditRepository extends JpaRepository<StaffAuditEvent, UUID> {
}
