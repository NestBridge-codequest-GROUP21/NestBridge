package com.nestbridge.media;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {

    /** Soft max advertised to clients; S3 PUT itself is client-side. */
    public static final long MAX_UPLOAD_BYTES = 5L * 1024 * 1024;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png");

    @Value("${aws.s3.enabled:false}")
    private boolean s3Enabled;

    @Value("${aws.s3.bucket:}")
    private String bucket;

    @Value("${aws.s3.region:eu-west-1}")
    private String region;

    @Value("${aws.access-key-id:}")
    private String accessKeyId;

    @Value("${aws.secret-access-key:}")
    private String secretAccessKey;

    @Value("${aws.s3.public-base-url:}")
    private String publicBaseUrl;

    public boolean isUploadConfigured() {
        return s3Enabled && bucket != null && !bucket.isBlank()
                && accessKeyId != null && !accessKeyId.isBlank();
    }

    public PhotoUploadUrlResponse createProfilePhotoUploadUrl(UUID userId, String contentType) {
        if (!isUploadConfigured()) {
            return PhotoUploadUrlResponse.builder().enabled(false).build();
        }

        String normalizedType = normalizeContentType(contentType);
        String extension = normalizedType.equals("image/png") ? "png" : "jpg";
        String key = "profiles/" + userId + "/" + UUID.randomUUID() + "." + extension;

        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)))
                .build()) {

            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(normalizedType)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(10))
                    .putObjectRequest(objectRequest)
                    .build();

            String uploadUrl = presigner.presignPutObject(presignRequest).url().toString();
            String publicUrl = resolvePublicUrl(key);

            return PhotoUploadUrlResponse.builder()
                    .enabled(true)
                    .uploadUrl(uploadUrl)
                    .publicUrl(publicUrl)
                    .contentType(normalizedType)
                    .maxBytes(MAX_UPLOAD_BYTES)
                    .build();
        } catch (Exception e) {
            log.error("S3 presign failed", e);
            return PhotoUploadUrlResponse.builder().enabled(false).build();
        }
    }

    public boolean isTrustedProfilePhotoUrl(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }
        String trimmed = url.trim();
        String trustedBase = publicBaseUrl != null && !publicBaseUrl.isBlank()
                ? publicBaseUrl.replaceAll("/$", "")
                : (bucket == null || bucket.isBlank()
                        ? null
                        : "https://" + bucket + ".s3." + region + ".amazonaws.com");
        if (trustedBase == null) {
            return false;
        }
        return trimmed.startsWith(trustedBase + "/");
    }

    private String resolvePublicUrl(String key) {
        if (publicBaseUrl != null && !publicBaseUrl.isBlank()) {
            return publicBaseUrl.replaceAll("/$", "") + "/" + key;
        }
        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
    }

    static String normalizeContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "contentType is required.");
        }
        String normalized = contentType.trim().toLowerCase(Locale.ROOT);
        int semi = normalized.indexOf(';');
        if (semi >= 0) {
            normalized = normalized.substring(0, semi).trim();
        }
        if (!ALLOWED_CONTENT_TYPES.contains(normalized)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only JPEG and PNG images are allowed.");
        }
        return "image/jpg".equals(normalized) ? "image/jpeg" : normalized;
    }
}
