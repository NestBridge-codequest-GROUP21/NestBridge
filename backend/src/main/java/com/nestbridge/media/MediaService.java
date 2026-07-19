package com.nestbridge.media;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {

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

    public PhotoUploadUrlResponse createProfilePhotoUploadUrl(UUID userId, String contentType) {
        if (!s3Enabled || bucket == null || bucket.isBlank()
                || accessKeyId == null || accessKeyId.isBlank()) {
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
            String publicUrl = publicBaseUrl != null && !publicBaseUrl.isBlank()
                    ? publicBaseUrl.replaceAll("/$", "") + "/" + key
                    : "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;

            return PhotoUploadUrlResponse.builder()
                    .enabled(true)
                    .uploadUrl(uploadUrl)
                    .publicUrl(publicUrl)
                    .contentType(normalizedType)
                    .build();
        } catch (Exception e) {
            log.error("S3 presign failed", e);
            return PhotoUploadUrlResponse.builder().enabled(false).build();
        }
    }

    private static String normalizeContentType(String contentType) {
        if (contentType != null && contentType.toLowerCase().contains("png")) {
            return "image/png";
        }
        return "image/jpeg";
    }
}
