package com.nestbridge.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query("""
            SELECT c FROM Conversation c WHERE
            (c.participantA = :a AND c.participantB = :b)
            OR (c.participantA = :b AND c.participantB = :a)
            """)
    Optional<Conversation> findBetween(@Param("a") UUID a, @Param("b") UUID b);
}
