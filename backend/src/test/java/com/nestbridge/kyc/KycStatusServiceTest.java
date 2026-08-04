package com.nestbridge.kyc;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class KycStatusServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private KycVerificationJobRepository jobRepository;

    @InjectMocks
    private KycStatusService kycStatusService;

    @Test
    void approvedUser_returnsApproved() {
        UUID userId = UUID.randomUUID();
        User user = User.builder().userId(userId).identityVerified(true).build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(jobRepository.findTopByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Optional.empty());

        KycStatusResponse status = kycStatusService.getStatus(userId);
        assertEquals("approved", status.getStatus());
    }

    @Test
    void rejectedJob_returnsReason() {
        UUID userId = UUID.randomUUID();
        User user = User.builder().userId(userId).identityVerified(false).build();
        KycVerificationJob job = KycVerificationJob.builder()
                .jobId(UUID.randomUUID())
                .userId(userId)
                .status("REJECTED")
                .rejectionReason("Blurry ID photo")
                .provider("MANUAL")
                .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(jobRepository.findTopByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Optional.of(job));

        KycStatusResponse status = kycStatusService.getStatus(userId);
        assertEquals("rejected", status.getStatus());
        assertEquals("Blurry ID photo", status.getRejectionReason());
    }

    @Test
    void pendingJob_returnsPending() {
        UUID userId = UUID.randomUUID();
        User user = User.builder().userId(userId).identityVerified(false).build();
        KycVerificationJob job = KycVerificationJob.builder()
                .jobId(UUID.randomUUID())
                .userId(userId)
                .status("PENDING")
                .provider("MANUAL")
                .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(jobRepository.findTopByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Optional.of(job));

        KycStatusResponse status = kycStatusService.getStatus(userId);
        assertEquals("pending", status.getStatus());
        assertNull(status.getRejectionReason());
    }
}
