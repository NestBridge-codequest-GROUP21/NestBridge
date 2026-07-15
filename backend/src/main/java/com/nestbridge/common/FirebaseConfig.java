package com.nestbridge.common;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.FirebaseDatabase;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.enabled:false}")
    private boolean firebaseEnabled;

    @Value("${firebase.credentials.path:}")
    private String credentialsPath;

    @Value("${firebase.credentials-json:}")
    private String credentialsJson;

    @Value("${firebase.database-url:}")
    private String databaseUrl;

    @PostConstruct
    void init() {
        if (!firebaseEnabled) {
            log.info("Firebase disabled — chat messages use REST/Postgres fallback.");
            return;
        }

        try (InputStream stream = openCredentialsStream()) {
            if (stream == null) {
                log.warn("firebase.enabled=true but no credentials were provided.");
                return;
            }
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

    private InputStream openCredentialsStream() throws IOException {
        if (credentialsJson != null && !credentialsJson.isBlank()) {
            log.info("Loading Firebase credentials from FIREBASE_CREDENTIALS_JSON env.");
            return new ByteArrayInputStream(credentialsJson.getBytes(StandardCharsets.UTF_8));
        }
        if (credentialsPath == null || credentialsPath.isBlank()) {
            return null;
        }
        Path path = Path.of(credentialsPath);
        if (!Files.isRegularFile(path)) {
            log.warn("Firebase credentials file not found: {}", credentialsPath);
            return null;
        }
        return new FileInputStream(path.toFile());
    }
}
