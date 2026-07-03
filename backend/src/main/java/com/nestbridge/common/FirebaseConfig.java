package com.nestbridge.common;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.FirebaseDatabase;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.enabled:false}")
    private boolean firebaseEnabled;

    @Value("${firebase.credentials.path:}")
    private String credentialsPath;

    @Value("${firebase.database-url:}")
    private String databaseUrl;

    @PostConstruct
    void init() {
        if (!firebaseEnabled) {
            log.info("Firebase disabled — chat messages use REST/Postgres fallback.");
            return;
        }
        if (credentialsPath == null || credentialsPath.isBlank()) {
            log.warn("firebase.enabled=true but firebase.credentials.path is empty.");
            return;
        }
        Path path = Path.of(credentialsPath);
        if (!Files.isRegularFile(path)) {
            log.warn("Firebase credentials file not found: {}", credentialsPath);
            return;
        }
        try (FileInputStream stream = new FileInputStream(path.toFile())) {
            FirebaseOptions.Builder builder = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(stream));
            if (databaseUrl != null && !databaseUrl.isBlank()) {
                builder.setDatabaseUrl(databaseUrl);
            }
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(builder.build());
            }
            FirebaseDatabase.getInstance().getReference().keepSynced(false);
            log.info("Firebase Admin initialized.");
        } catch (IOException e) {
            log.error("Failed to initialize Firebase Admin", e);
        }
    }
}
