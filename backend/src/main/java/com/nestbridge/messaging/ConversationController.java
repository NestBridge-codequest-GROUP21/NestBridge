package com.nestbridge.messaging;

import com.nestbridge.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConversationListDto>>> list(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Conversations loaded",
                conversationService.listConversations(userId)));
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ApiResponse<ConversationListDto>> get(
            Authentication authentication,
            @PathVariable UUID conversationId) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Conversation loaded",
                conversationService.getConversation(userId, conversationId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ConversationDto>> create(
            Authentication authentication,
            @RequestBody CreateConversationRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Conversation created",
                conversationService.createConversation(userId, request)));
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> messages(
            Authentication authentication,
            @PathVariable UUID conversationId) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Messages loaded",
                conversationService.getMessages(userId, conversationId)));
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<ChatMessageDto>> send(
            Authentication authentication,
            @PathVariable UUID conversationId,
            @Valid @RequestBody SendMessageRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Message sent",
                conversationService.sendMessage(userId, conversationId, request)));
    }
}
