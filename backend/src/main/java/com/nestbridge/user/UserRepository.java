package com.nestbridge.user;

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

    @Query("""
            SELECT u FROM User u
            WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
            ORDER BY u.fullName ASC
            """)
    List<User> searchByEmailOrName(@Param("query") String query, Pageable pageable);
}
