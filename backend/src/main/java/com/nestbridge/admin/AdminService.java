package com.nestbridge.admin;

import com.nestbridge.booking.Booking;
import com.nestbridge.booking.BookingRepository;
import com.nestbridge.common.ProfileStatus;
import com.nestbridge.guide.GuideProfile;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.host.HostProfile;
import com.nestbridge.host.HostProfileRepository;
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

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final int SEARCH_LIMIT = 50;
    private static final int ACTIVITY_LIMIT = 25;

    private final StaffGuard staffGuard;
    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final ProviderSetupRepository providerSetupRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final BookingRepository bookingRepository;
    private final SosEventRepository sosEventRepository;

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
        return toDetail(user);
    }

    @Transactional
    public AdminUserDetailDto setKycStatus(UUID actorId, UUID userId, boolean identityVerified) {
        staffGuard.requireStaff(actorId);
        User user = requireUser(userId);
        user.setIdentityVerified(identityVerified);
        userRepository.save(user);
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
    public AdminListingHideResultDto hideListing(UUID actorId, UUID listingId) {
        staffGuard.requireStaff(actorId);

        var host = hostProfileRepository.findById(listingId);
        if (host.isPresent()) {
            HostProfile profile = host.get();
            profile.setActive(false);
            hostProfileRepository.save(profile);
            return AdminListingHideResultDto.builder()
                    .listingId(profile.getHostId())
                    .type("HOST")
                    .active(false)
                    .hidden(true)
                    .build();
        }

        var guide = guideProfileRepository.findById(listingId);
        if (guide.isPresent()) {
            GuideProfile profile = guide.get();
            profile.setActive(false);
            guideProfileRepository.save(profile);
            return AdminListingHideResultDto.builder()
                    .listingId(profile.getGuideId())
                    .type("GUIDE")
                    .active(false)
                    .hidden(true)
                    .build();
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found.");
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
