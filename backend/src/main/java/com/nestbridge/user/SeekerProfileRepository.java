package com.nestbridge.user;

import com.nestbridge.common.PrimaryIntent;
import com.nestbridge.common.ProfileStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, UUID> {

    @Query("""
            SELECT s FROM SeekerProfile s
            JOIN FETCH s.user u
            WHERE s.status = :status
              AND u.primaryIntent = :intent
              AND u.suspended = false
            """)
    List<SeekerProfile> findCompleteSeekersByIntent(
            @Param("status") ProfileStatus status,
            @Param("intent") PrimaryIntent intent);
}
