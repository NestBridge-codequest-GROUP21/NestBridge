package com.nestbridge.messaging;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConversationListDto {
    private String conversationId;
    private String participantId;
    private String participantName;
    private String participantInitials;
    private String participantRole;
    private String firebasePath;
    private String lastMessage;
    private String lastMessageAt;
    private int unreadCount;
}
