package com.nestbridge.kyc;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KycStatusService {

    private final UserRepository userRepository;
    private final KycVerificationJobRepository jobRepository;

    @Transactional(readOnly = true)
    public KycStatusResponse getStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        var latest = jobRepository.findTopByUserIdOrderByCreatedAtDesc(userId);

        if (user.isIdentityVerified()) {
            return KycStatusResponse.builder()
                    .status("approved")
                    .identityVerified(true)
                    .jobId(latest.map(j -> j.getJobId().toString()).orElse(null))
                    .provider(latest.map(KycVerificationJob::getProvider).orElse(null))
                    .updatedAt(latest.map(j -> j.getCompletedAt() != null ? j.getCompletedAt() : j.getCreatedAt())
                            .orElse(null))
                    .build();
        }

        if (latest.isEmpty()) {
            return KycStatusResponse.builder()
                    .status("none")
                    .identityVerified(false)
                    .build();
        }

        KycVerificationJob job = latest.get();
        String status = switch (job.getStatus() == null ? "" : job.getStatus().toUpperCase()) {
            case "PENDING" -> "pending";
            case "APPROVED" -> "approved";
            case "REJECTED" -> "rejected";
            case "EXPIRED" -> "none";
            default -> "none";
        };

        return KycStatusResponse.builder()
                .status(status)
                .rejectionReason("rejected".equals(status) ? job.getRejectionReason() : null)
                .jobId(job.getJobId().toString())
                .provider(job.getProvider())
                .identityVerified(false)
                .updatedAt(job.getCompletedAt() != null ? job.getCompletedAt() : job.getCreatedAt())
                .build();
    }
}
