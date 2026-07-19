package com.nestbridge.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query("""
            SELECT c FROM Conversation c WHERE
            (c.participantA = :a AND c.participantB = :b)
            OR (c.participantA = :b AND c.participantB = :a)
            """)
    Optional<Conversation> findBetween(@Param("a") UUID a, @Param("b") UUID b);

    @Query("""
            SELECT c FROM Conversation c WHERE
            c.participantA = :userId OR c.participantB = :userId
            ORDER BY c.createdAt DESC
            """)
    List<Conversation> findAllForUser(@Param("userId") UUID userId);
}
