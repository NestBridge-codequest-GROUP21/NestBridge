package com.nestbridge.messaging;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateConversationRequest {
    private UUID participantId;
}
