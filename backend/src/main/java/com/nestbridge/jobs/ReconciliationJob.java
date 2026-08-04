package com.nestbridge.jobs;

import com.nestbridge.kyc.KycVerificationJobRepository;
import com.nestbridge.notification.NotificationDeliveryFailure;
import com.nestbridge.notification.NotificationDeliveryFailureRepository;
import com.nestbridge.notification.PushNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Hourly cleanup: expire stuck KYC jobs and retry failed push deliveries.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ReconciliationJob {

    private static final int STALE_KYC_HOURS = 72;
    private static final int RETRY_BATCH = 50;

    private final KycVerificationJobRepository kycVerificationJobRepository;
    private final NotificationDeliveryFailureRepository failureRepository;
    private final PushNotificationService pushNotificationService;

    @Scheduled(cron = "0 15 * * * *")
    @Transactional
    public void reconcile() {
        OffsetDateTime now = OffsetDateTime.now();
        int expired = kycVerificationJobRepository.expireStalePending(
                now.minusHours(STALE_KYC_HOURS), now);
        if (expired > 0) {
            log.info("Expired {} stale PENDING KYC jobs", expired);
        }

        List<NotificationDeliveryFailure> due = failureRepository
                .findByResolvedAtIsNullAndNextAttemptAtBeforeOrderByNextAttemptAtAsc(
                        now, PageRequest.of(0, RETRY_BATCH));
        for (NotificationDeliveryFailure failure : due) {
            boolean ok = pushNotificationService.sendToUser(
                    failure.getUserId(),
                    failure.getTitle(),
                    failure.getBody(),
                    failure.getDataJson());
            failure.setAttempts(failure.getAttempts() + 1);
            if (ok) {
                failure.setResolvedAt(now);
                failure.setLastError(null);
            } else if (failure.getAttempts() >= failure.getMaxAttempts()) {
                failure.setResolvedAt(now);
                failure.setLastError("Gave up after " + failure.getAttempts() + " attempts");
            } else {
                long delayMinutes = Math.min(60L * failure.getAttempts(), 360L);
                failure.setNextAttemptAt(now.plusMinutes(delayMinutes));
                failure.setLastError("Retry scheduled");
            }
            failureRepository.save(failure);
        }
        if (!due.isEmpty()) {
            log.info("Processed {} notification delivery retries", due.size());
        }
    }
}
