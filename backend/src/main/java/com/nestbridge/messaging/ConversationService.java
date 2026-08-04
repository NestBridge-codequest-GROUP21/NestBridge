package com.nestbridge.messaging;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.user.ProfileGateService;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final ProfileGateService profileGateService;

    @Value("${firebase.enabled:false}")
    private boolean firebaseEnabled;

    @Transactional
    public ConversationDto createConversation(UUID userId, CreateConversationRequest request) {
        profileGateService.requireSeekerIdentityForMessaging(userId);
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

    public List<ConversationListDto> listConversations(UUID userId) {
        List<Conversation> conversations = conversationRepository.findAllForUser(userId);
        List<ConversationListDto> result = new ArrayList<>();
        for (Conversation conversation : conversations) {
            UUID otherId = conversation.getParticipantA().equals(userId)
                    ? conversation.getParticipantB()
                    : conversation.getParticipantA();
            ParticipantInfo info = resolveParticipant(otherId);
            ChatMessage last = chatMessageRepository
                    .findTopByConversationIdOrderBySentAtDesc(conversation.getConversationId())
                    .orElse(null);
            result.add(ConversationListDto.builder()
                    .conversationId(conversation.getConversationId().toString())
                    .participantId(otherId.toString())
                    .participantName(info.name())
                    .participantInitials(info.initials())
                    .participantRole(info.role())
                    .firebasePath(conversation.getFirebasePath())
                    .lastMessage(last != null ? last.getBody() : "Start a conversation")
                    .lastMessageAt(last != null ? last.getSentAt().format(ISO) : conversation.getCreatedAt().format(ISO))
                    .unreadCount(0)
                    .build());
        }
        return result;
    }

    public ConversationListDto getConversation(UUID userId, UUID conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found."));
        if (!conversation.getParticipantA().equals(userId) && !conversation.getParticipantB().equals(userId)) {
            throw new IllegalArgumentException("Not a participant in this conversation.");
        }
        UUID otherId = conversation.getParticipantA().equals(userId)
                ? conversation.getParticipantB()
                : conversation.getParticipantA();
        ParticipantInfo info = resolveParticipant(otherId);
        ChatMessage last = chatMessageRepository
                .findTopByConversationIdOrderBySentAtDesc(conversationId)
                .orElse(null);
        return ConversationListDto.builder()
                .conversationId(conversation.getConversationId().toString())
                .participantId(otherId.toString())
                .participantName(info.name())
                .participantInitials(info.initials())
                .participantRole(info.role())
                .firebasePath(conversation.getFirebasePath())
                .lastMessage(last != null ? last.getBody() : "Start a conversation")
                .lastMessageAt(last != null ? last.getSentAt().format(ISO)
                        : conversation.getCreatedAt().format(ISO))
                .unreadCount(0)
                .build();
    }

    public List<ChatMessageDto> getMessages(UUID userId, UUID conversationId) {
        assertParticipant(userId, conversationId);
        return chatMessageRepository.findByConversationIdOrderBySentAtAsc(conversationId).stream()
                .map(this::toMessageDto)
                .toList();
    }

    @Transactional
    public ChatMessageDto sendMessage(UUID userId, UUID conversationId, SendMessageRequest request) {
        assertParticipant(userId, conversationId);
        String text = request.getText().trim();
        if (text.isEmpty()) {
            throw new IllegalArgumentException("Message text is required.");
        }
        ChatMessage saved = chatMessageRepository.save(ChatMessage.builder()
                .conversationId(conversationId)
                .senderId(userId)
                .body(text)
                .build());
        pushToFirebaseIfEnabled(conversationId, saved);
        return toMessageDto(saved);
    }

    private void assertParticipant(UUID userId, UUID conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found."));
        if (!conversation.getParticipantA().equals(userId) && !conversation.getParticipantB().equals(userId)) {
            throw new IllegalArgumentException("Not a participant in this conversation.");
        }
    }

    private void pushToFirebaseIfEnabled(UUID conversationId, ChatMessage message) {
        if (!firebaseEnabled || !FirebaseAppAvailable()) {
            return;
        }
        try {
            Conversation conversation = conversationRepository.findById(conversationId).orElse(null);
            if (conversation == null || conversation.getFirebasePath() == null) {
                return;
            }
            DatabaseReference ref = FirebaseDatabase.getInstance()
                    .getReference(conversation.getFirebasePath())
                    .child("messages")
                    .child(message.getMessageId().toString());
            Map<String, Object> payload = new HashMap<>();
            payload.put("senderId", message.getSenderId().toString());
            payload.put("text", message.getBody());
            payload.put("sentAt", message.getSentAt().format(ISO));
            ref.setValueAsync(payload);
        } catch (Exception ignored) {
            // Postgres remains source of truth when Firebase push fails
        }
    }

    private boolean FirebaseAppAvailable() {
        try {
            return com.google.firebase.FirebaseApp.getApps() != null
                    && !com.google.firebase.FirebaseApp.getApps().isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    private ParticipantInfo resolveParticipant(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return new ParticipantInfo("Unknown", "??", "guest");
        }
        String name = user.getFullName();
        String initials = initialsFromName(name);
        String role = "guest";
        if (hostProfileRepository.findByUserId(userId).isPresent()) {
            role = "host";
        } else if (guideProfileRepository.findByUserId(userId).isPresent()) {
            role = "guide";
        }
        return new ParticipantInfo(name, initials, role);
    }

    private String initialsFromName(String name) {
        if (name == null || name.isBlank()) {
            return "??";
        }
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }

    private String buildFirebasePath(UUID a, UUID b) {
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

    private ChatMessageDto toMessageDto(ChatMessage message) {
        return ChatMessageDto.builder()
                .messageId(message.getMessageId().toString())
                .senderId(message.getSenderId().toString())
                .text(message.getBody())
                .sentAt(message.getSentAt().format(ISO))
                .build();
    }

    private record ParticipantInfo(String name, String initials, String role) {}
}
