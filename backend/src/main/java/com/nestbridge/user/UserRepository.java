package com.nestbridge.user;

import com.nestbridge.common.PrimaryIntent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByPrimaryIntent(PrimaryIntent primaryIntent);

    long countByStaffTrue();

    List<User> findByStaffTrue();

    long countBySuspendedTrue();

    long countByIdentityVerifiedFalse();

    long countByEmailVerifiedFalse();

    @Query("""
            SELECT u FROM User u
            WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
            ORDER BY u.fullName ASC
            """)
    List<User> searchByEmailOrName(@Param("query") String query, Pageable pageable);

    @Query("""
            SELECT u FROM User u
            WHERE (:intent IS NULL OR u.primaryIntent = :intent)
              AND (:staffOnly = false OR u.staff = true)
              AND (
                    :query = ''
                    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
                    OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
                  )
            ORDER BY u.fullName ASC
            """)
    List<User> listForAdmin(
            @Param("intent") PrimaryIntent intent,
            @Param("staffOnly") boolean staffOnly,
            @Param("query") String query,
            Pageable pageable);
}
