package com.nestbridge.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, UUID> {
}
