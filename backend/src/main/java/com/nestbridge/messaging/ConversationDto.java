package com.nestbridge.messaging;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ConversationDto {
    private UUID conversationId;
    private UUID participantA;
    private UUID participantB;
    private String firebasePath;
}
