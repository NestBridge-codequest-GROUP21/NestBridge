package com.nestbridge.matching;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MatchRecordRepository extends JpaRepository<MatchRecord, UUID> {
}
