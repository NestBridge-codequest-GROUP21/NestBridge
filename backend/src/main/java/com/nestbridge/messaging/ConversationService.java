package com.nestbridge.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;

    @Value("${firebase.enabled:false}")
    private boolean firebaseEnabled;

    @Transactional
    public ConversationDto createConversation(UUID userId, CreateConversationRequest request) {
        if (request.getParticipantId() == null) {
            throw new IllegalArgumentException("participantId is required.");
        }
        UUID other = request.getParticipantId();
        Conversation conversation = conversationRepository.findBetween(userId, other)
                .orElseGet(() -> conversationRepository.save(Conversation.builder()
                        .participantA(userId)
                        .participantB(other)
                        .firebasePath(buildFirebasePath(userId, other))
                        .build()));
        return toDto(conversation);
    }

    private String buildFirebasePath(UUID a, UUID b) {
        if (!firebaseEnabled) {
            return "conversations/" + a + "_" + b;
        }
        String sorted = a.compareTo(b) < 0 ? a + "_" + b : b + "_" + a;
        return "conversations/" + sorted;
    }

    private ConversationDto toDto(Conversation c) {
        return ConversationDto.builder()
                .conversationId(c.getConversationId())
                .participantA(c.getParticipantA())
                .participantB(c.getParticipantB())
                .firebasePath(c.getFirebasePath())
                .build();
    }
}
