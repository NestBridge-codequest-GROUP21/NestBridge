package com.nestbridge.admin;

import com.nestbridge.booking.Booking;
import com.nestbridge.booking.BookingRepository;
import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.PrimaryIntent;
import com.nestbridge.common.ProfileStatus;
import com.nestbridge.guide.GuideProfile;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.host.HostProfile;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.kyc.KycVerificationJobRepository;
import com.nestbridge.user.ProviderSetup;
import com.nestbridge.user.ProviderSetupRepository;
import com.nestbridge.user.SeekerProfile;
import com.nestbridge.user.SeekerProfileRepository;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import com.nestbridge.welfare.SosEvent;
import com.nestbridge.welfare.SosEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final int SEARCH_LIMIT = 50;
    private static final int ACTIVITY_LIMIT = 25;
    private static final int OVERVIEW_FEED_LIMIT = 12;
    private static final int LISTINGS_LIMIT = 100;

    private final StaffGuard staffGuard;
    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final ProviderSetupRepository providerSetupRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final BookingRepository bookingRepository;
    private final SosEventRepository sosEventRepository;
    private final StaffAuditRepository staffAuditRepository;
    private final KycVerificationJobRepository kycVerificationJobRepository;

    @Transactional(readOnly = true)
    public AdminOverviewDto getOverview(UUID actorId) {
        staffGuard.requireStaff(actorId);

        LocalDateTime now = LocalDateTime.now();
        List<AdminBookingActivityDto> recentBookings = bookingRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, OVERVIEW_FEED_LIMIT))
                .stream()
                .map(this::toBookingActivity)
                .collect(Collectors.toList());
        List<AdminSosActivityDto> recentSos = sosEventRepository
                .findAllByOrderByTriggeredAtDesc(PageRequest.of(0, OVERVIEW_FEED_LIMIT))
                .stream()
                .map(this::toSosActivity)
                .collect(Collectors.toList());

        return AdminOverviewDto.builder()
                .totalUsers(userRepository.count())
                .studentCount(userRepository.countByPrimaryIntent(PrimaryIntent.STUDENT))
                .touristCount(userRepository.countByPrimaryIntent(PrimaryIntent.TOURIST))
                .hostCount(userRepository.countByPrimaryIntent(PrimaryIntent.HOST))
                .guideCount(userRepository.countByPrimaryIntent(PrimaryIntent.GUIDE))
                .staffCount(userRepository.countByStaffTrue())
                .suspendedCount(userRepository.countBySuspendedTrue())
                .unverifiedIdentityCount(userRepository.countByIdentityVerifiedFalse())
                .unverifiedEmailCount(userRepository.countByEmailVerifiedFalse())
                .activeHostListings(hostProfileRepository.countByActiveTrue())
                .activeGuideListings(guideProfileRepository.countByActiveTrue())
                .hiddenHostListings(hostProfileRepository.countByActiveFalse())
                .hiddenGuideListings(guideProfileRepository.countByActiveFalse())
                .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING_HOST))
                .confirmedBookings(
                        bookingRepository.countByStatus(BookingStatus.CONFIRMED)
                                + bookingRepository.countByStatus(BookingStatus.ACCEPTED)
                                + bookingRepository.countByStatus(BookingStatus.CHECKED_IN))
                .sosLast24Hours(sosEventRepository.countByTriggeredAtAfter(now.minusHours(24)))
                .sosLast7Days(sosEventRepository.countByTriggeredAtAfter(now.minusDays(7)))
                .recentBookings(recentBookings)
                .recentSosAlerts(recentSos)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminListingModerationDto> listListings(UUID actorId, String typeFilter, Boolean hiddenFilter) {
        staffGuard.requireStaff(actorId);
        String type = typeFilter == null ? "" : typeFilter.trim().toUpperCase(Locale.ROOT);

        List<AdminListingModerationDto> listings = new ArrayList<>();
        if (type.isEmpty() || "HOST".equals(type)) {
            for (HostProfile host : hostProfileRepository.findAll()) {
                listings.add(toListingModeration(host));
            }
        }
        if (type.isEmpty() || "GUIDE".equals(type)) {
            for (GuideProfile guide : guideProfileRepository.findAll()) {
                listings.add(toListingModeration(guide));
            }
        }

        return listings.stream()
                .filter(item -> hiddenFilter == null || item.isHidden() == hiddenFilter)
                .sorted(Comparator
                        .comparing(AdminListingModerationDto::isHidden).reversed()
                        .thenComparing(item -> item.getOwnerName() == null ? "" : item.getOwnerName(),
                                String.CASE_INSENSITIVE_ORDER))
                .limit(LISTINGS_LIMIT)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AdminUserSummaryDto> searchUsers(UUID actorId, String query) {
        staffGuard.requireStaff(actorId);
        String trimmed = query == null ? "" : query.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("query is required.");
        }
        return userRepository.searchByEmailOrName(trimmed, PageRequest.of(0, SEARCH_LIMIT)).stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminUserDetailDto getUser(UUID actorId, UUID userId) {
        staffGuard.requireStaff(actorId);
        User user = requireUser(userId);
        return toDetail(user);
    }

    @Transactional
    public AdminUserDetailDto setSuspended(UUID actorId, UUID userId, boolean suspended) {
        User actor = staffGuard.requireStaff(actorId);
        if (actor.getUserId().equals(userId) && suspended) {
            throw new IllegalArgumentException("You cannot suspend your own staff account.");
        }
        User user = requireUser(userId);
        user.setSuspended(suspended);
        userRepository.save(user);
        writeAudit(actorId, suspended ? "USER_SUSPEND" : "USER_UNSUSPEND", userId.toString());
        return toDetail(user);
    }

    @Transactional
    public AdminUserDetailDto setKycStatus(UUID actorId, UUID userId, boolean identityVerified) {
        staffGuard.requireStaff(actorId);
        User user = requireUser(userId);
        user.setIdentityVerified(identityVerified);
        userRepository.save(user);
        if (identityVerified) {
            kycVerificationJobRepository.findTopByUserIdOrderByCreatedAtDesc(userId).ifPresent(job -> {
                if ("PENDING".equals(job.getStatus())) {
                    job.setStatus("APPROVED");
                    job.setCompletedAt(OffsetDateTime.now());
                    kycVerificationJobRepository.save(job);
                }
            });
        }
        writeAudit(actorId, identityVerified ? "KYC_VERIFY" : "KYC_CLEAR", userId.toString());
        return toDetail(user);
    }

    @Transactional
    public AdminUserDetailDto setEmailVerified(UUID actorId, UUID userId, boolean emailVerified) {
        staffGuard.requireStaff(actorId);
        User user = requireUser(userId);
        user.setEmailVerified(emailVerified);
        if (emailVerified) {
            user.setEmailVerifiedAt(java.time.OffsetDateTime.now());
        } else {
            user.setEmailVerifiedAt(null);
        }
        userRepository.save(user);
        writeAudit(actorId, emailVerified ? "EMAIL_VERIFY" : "EMAIL_CLEAR", userId.toString());
        return toDetail(user);
    }

    @Transactional
    public AdminUserDetailDto setStaffStatus(UUID actorId, UUID userId, boolean isStaff) {
        User actor = staffGuard.requireStaff(actorId);
        if (actor.getUserId().equals(userId) && !isStaff) {
            throw new IllegalArgumentException("You cannot revoke your own staff access.");
        }
        User user = requireUser(userId);
        user.setStaff(isStaff);
        userRepository.save(user);
        writeAudit(actorId, isStaff ? "STAFF_GRANT" : "STAFF_REVOKE", userId.toString());
        return toDetail(user);
    }

    @Transactional(readOnly = true)
    public AdminUserActivityDto getUserActivity(UUID actorId, UUID userId) {
        staffGuard.requireStaff(actorId);
        requireUser(userId);

        List<UUID> providerIds = new ArrayList<>();
        providerIds.add(userId);
        hostProfileRepository.findByUserId(userId).ifPresent(h -> providerIds.add(h.getHostId()));
        guideProfileRepository.findByUserId(userId).ifPresent(g -> providerIds.add(g.getGuideId()));

        List<AdminBookingActivityDto> bookings = bookingRepository
                .findRecentActivityForUser(userId, providerIds)
                .stream()
                .limit(ACTIVITY_LIMIT)
                .map(this::toBookingActivity)
                .collect(Collectors.toList());

        List<AdminSosActivityDto> sosAlerts = sosEventRepository
                .findByUserIdOrderByTriggeredAtDesc(userId, PageRequest.of(0, ACTIVITY_LIMIT))
                .stream()
                .map(this::toSosActivity)
                .collect(Collectors.toList());

        return AdminUserActivityDto.builder()
                .userId(userId)
                .recentBookings(bookings)
                .recentSosAlerts(sosAlerts)
                .build();
    }

    @Transactional
    public AdminListingHideResultDto setListingVisibility(UUID actorId, UUID listingId, boolean hidden) {
        staffGuard.requireStaff(actorId);

        var host = hostProfileRepository.findById(listingId);
        if (host.isPresent()) {
            HostProfile profile = host.get();
            profile.setActive(!hidden);
            hostProfileRepository.save(profile);
            writeAudit(actorId, hidden ? "LISTING_HIDE" : "LISTING_UNHIDE",
                    "HOST:" + profile.getHostId());
            return AdminListingHideResultDto.builder()
                    .listingId(profile.getHostId())
                    .type("HOST")
                    .active(profile.isActive())
                    .hidden(!profile.isActive())
                    .build();
        }

        var guide = guideProfileRepository.findById(listingId);
        if (guide.isPresent()) {
            GuideProfile profile = guide.get();
            profile.setActive(!hidden);
            guideProfileRepository.save(profile);
            writeAudit(actorId, hidden ? "LISTING_HIDE" : "LISTING_UNHIDE",
                    "GUIDE:" + profile.getGuideId());
            return AdminListingHideResultDto.builder()
                    .listingId(profile.getGuideId())
                    .type("GUIDE")
                    .active(profile.isActive())
                    .hidden(!profile.isActive())
                    .build();
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found.");
    }

    /** @deprecated Prefer {@link #setListingVisibility(UUID, UUID, boolean)} */
    @Transactional
    public AdminListingHideResultDto hideListing(UUID actorId, UUID listingId) {
        return setListingVisibility(actorId, listingId, true);
    }

    @Transactional
    public StaffAuditResultDto recordAudit(UUID actorId, String action, String detail) {
        staffGuard.requireStaff(actorId);
        String normalizedAction = action == null ? "" : action.trim().toUpperCase(Locale.ROOT);
        if (normalizedAction.isEmpty()) {
            throw new IllegalArgumentException("action is required.");
        }
        StaffAuditEvent saved = writeAudit(actorId, normalizedAction, detail);
        return StaffAuditResultDto.builder()
                .auditId(saved.getAuditId())
                .action(saved.getAction())
                .detail(saved.getDetail())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    private StaffAuditEvent writeAudit(UUID actorId, String action, String detail) {
        StaffAuditEvent event = StaffAuditEvent.builder()
                .actorId(actorId)
                .action(action)
                .detail(detail)
                .build();
        return staffAuditRepository.save(event);
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    private AdminUserSummaryDto toSummary(User user) {
        return AdminUserSummaryDto.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .primaryIntent(user.getPrimaryIntent())
                .identityVerified(user.isIdentityVerified())
                .emailVerified(user.isEmailVerified())
                .staff(user.isStaff())
                .suspended(user.isSuspended())
                .build();
    }

    private AdminUserDetailDto toDetail(User user) {
        ProfileStatus seekerStatus = seekerProfileRepository.findById(user.getUserId())
                .map(SeekerProfile::getStatus)
                .orElse(ProfileStatus.NOT_STARTED);

        List<AdminListingStatusDto> listings = new ArrayList<>();
        hostProfileRepository.findByUserId(user.getUserId()).ifPresent(host -> {
            ProfileStatus setup = providerSetupRepository.findByUserIdAndTrack(user.getUserId(), "HOST")
                    .map(ProviderSetup::getStatus)
                    .orElse(ProfileStatus.NOT_STARTED);
            listings.add(AdminListingStatusDto.builder()
                    .type("HOST")
                    .listingId(host.getHostId())
                    .active(host.isActive())
                    .hidden(!host.isActive())
                    .setupStatus(setup)
                    .city(host.getCity())
                    .build());
        });
        guideProfileRepository.findByUserId(user.getUserId()).ifPresent(guide -> {
            ProfileStatus setup = providerSetupRepository.findByUserIdAndTrack(user.getUserId(), "GUIDE")
                    .map(ProviderSetup::getStatus)
                    .orElse(ProfileStatus.NOT_STARTED);
            listings.add(AdminListingStatusDto.builder()
                    .type("GUIDE")
                    .listingId(guide.getGuideId())
                    .active(guide.isActive())
                    .hidden(!guide.isActive())
                    .setupStatus(setup)
                    .city(guide.getCity())
                    .build());
        });

        return AdminUserDetailDto.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .primaryIntent(user.getPrimaryIntent())
                .identityVerified(user.isIdentityVerified())
                .emailVerified(user.isEmailVerified())
                .staff(user.isStaff())
                .suspended(user.isSuspended())
                .nationality(user.getNationality())
                .seekerSetupStatus(seekerStatus)
                .listings(listings)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private AdminListingModerationDto toListingModeration(HostProfile host) {
        User owner = userRepository.findById(host.getUserId()).orElse(null);
        return AdminListingModerationDto.builder()
                .listingId(host.getHostId())
                .type("HOST")
                .ownerUserId(host.getUserId())
                .ownerName(owner != null ? owner.getFullName() : "Unknown host")
                .ownerEmail(owner != null ? owner.getEmail() : null)
                .city(host.getCity())
                .active(host.isActive())
                .hidden(!host.isActive())
                .build();
    }

    private AdminListingModerationDto toListingModeration(GuideProfile guide) {
        User owner = userRepository.findById(guide.getUserId()).orElse(null);
        return AdminListingModerationDto.builder()
                .listingId(guide.getGuideId())
                .type("GUIDE")
                .ownerUserId(guide.getUserId())
                .ownerName(owner != null ? owner.getFullName() : "Unknown guide")
                .ownerEmail(owner != null ? owner.getEmail() : null)
                .city(guide.getCity())
                .active(guide.isActive())
                .hidden(!guide.isActive())
                .build();
    }

    private AdminBookingActivityDto toBookingActivity(Booking booking) {
        return AdminBookingActivityDto.builder()
                .bookingId(booking.getBookingId())
                .bookingType(booking.getBookingType())
                .status(booking.getStatus())
                .paymentStatus(booking.getPaymentStatus())
                .guestId(booking.getGuestId())
                .hostOrGuideId(booking.getHostOrGuideId())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .sessionDate(booking.getSessionDate())
                .totalPrice(booking.getTotalPrice())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private AdminSosActivityDto toSosActivity(SosEvent event) {
        return AdminSosActivityDto.builder()
                .sosId(event.getSosId())
                .triggeredAt(event.getTriggeredAt())
                .locationLat(event.getLocationLat())
                .locationLng(event.getLocationLng())
                .contactedEmergency(event.isContactedEmergency())
                .contactedSupport(event.isContactedSupport())
                .build();
    }
}
