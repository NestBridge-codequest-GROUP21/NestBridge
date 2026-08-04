package com.nestbridge.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {

    private final DeviceTokenRepository deviceTokenRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    /**
     * @return true if at least one push was accepted, false if skipped or all failed
     */
    public boolean sendToUser(java.util.UUID userId, String title, String body, Map<String, Object> data) {
        boolean enabled = userRepository.findById(userId)
                .map(user -> user.isNotificationsEnabled())
                .orElse(true);
        if (!enabled) {
            return false;
        }
        List<DeviceToken> tokens = deviceTokenRepository.findByUserId(userId);
        if (tokens.isEmpty()) {
            return false;
        }
        boolean anyOk = false;
        for (DeviceToken token : tokens) {
            if (sendExpoPush(token.getExpoPushToken(), title, body, data)) {
                anyOk = true;
            }
        }
        return anyOk;
    }

    private boolean sendExpoPush(String expoPushToken, String title, String body, Map<String, Object> data) {
        try {
            String json = objectMapper.writeValueAsString(Map.of(
                    "to", expoPushToken,
                    "title", title,
                    "body", body,
                    "data", data != null ? data : Map.of(),
                    "sound", "default"
            ));
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://exp.host/--/api/v2/push/send"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                log.warn("Expo push failed ({}): {}", response.statusCode(), response.body());
                return false;
            }
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        } catch (Exception e) {
            log.warn("Expo push error for token {}", expoPushToken, e);
            return false;
        }
    }
}
