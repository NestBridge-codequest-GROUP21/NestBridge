package com.nestbridge.kyc;

import java.time.OffsetDateTime;
import java.util.UUID;

public interface PendingKycJobSummary {
    UUID getJobId();

    UUID getUserId();

    String getProvider();

    OffsetDateTime getCreatedAt();

    Boolean getHasDocumentPhoto();

    String getDocumentPhotoUrl();
}
