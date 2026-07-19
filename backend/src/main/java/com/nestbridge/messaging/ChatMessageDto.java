package com.nestbridge.messaging;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessageDto {
    private String messageId;
    private String senderId;
    private String text;
    private String sentAt;
}
