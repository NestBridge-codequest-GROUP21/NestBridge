package com.nestbridge.booking;

import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.BookingType;
import com.nestbridge.guide.GuideProfile;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.host.HostProfile;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.matching.MatchRecord;
import com.nestbridge.matching.MatchRecordRepository;
import com.nestbridge.notification.BookingNotificationService;
import com.nestbridge.user.ProfileGateService;
import com.nestbridge.user.SeekerProfile;
import com.nestbridge.user.SeekerProfileRepository;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final BigDecimal PLATFORM_FEE_RATE = new BigDecimal("0.05");
    private static final int MAX_OVERLAP = 2;

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final MatchRecordRepository matchRecordRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final ProfileGateService profileGateService;
    private final BookingNotificationService bookingNotificationService;

    @Value("${paystack.enabled:false}")
    private boolean paystackEnabled;

    @Value("${paystack.secret-key:}")
    private String paystackSecretKey;

    @Transactional
    public BookingDto createBooking(UUID guestId, CreateBookingRequest request) {
        profileGateService.requireEmailVerified(guestId);
        profileGateService.requireSeekerComplete(guestId);
        BookingType type = request.getBookingType();
        BigDecimal total;
        BigDecimal platformFee;
        BigDecimal payout;

        if (type == BookingType.HOST) {
            long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
            if (nights <= 0) throw new IllegalArgumentException("Check-out must be after check-in.");
            BigDecimal subtotal = request.getNightlyRate().multiply(BigDecimal.valueOf(nights));
            platformFee = subtotal.multiply(PLATFORM_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
            total = subtotal.add(platformFee);
            payout = subtotal;
        } else {
            BigDecimal sessionRate = request.getSessionRate() != null ? request.getSessionRate() : BigDecimal.ZERO;
            platformFee = sessionRate.multiply(PLATFORM_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
            total = sessionRate.add(platformFee);
            payout = sessionRate;
        }

        Booking booking = Booking.builder()
                .matchId(request.getMatchId())
                .guestId(guestId)
                .hostOrGuideId(request.getHostOrGuideId())
                .bookingType(type)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .sessionDate(request.getSessionDate())
                .sessionStartTime(request.getSessionStartTime())
                .sessionDurationHours(request.getSessionDurationHours())
                .guestMessage(request.getGuestMessage())
                .totalPrice(total)
                .platformFee(platformFee)
                .hostPayout(payout)
                .status(BookingStatus.PENDING_HOST)
                .build();

        booking = bookingRepository.save(booking);
        bookingNotificationService.onBookingCreated(booking);
        return toDto(booking);
    }

    @Transactional(readOnly = true)
    public BookingDto getBooking(UUID bookingId, UUID requesterId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if (!booking.getGuestId().equals(requesterId) && !booking.getHostOrGuideId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized.");
        }
        return toDto(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getUserBookings(UUID userId) {
        return bookingRepository.findByGuestIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IncomingBookingDto> getIncomingBookings(UUID providerUserId, BookingStatus status, BookingType type) {
        UUID providerProfileId = resolveProviderProfileId(providerUserId, type);
        BookingStatus filterStatus = status != null ? status : BookingStatus.PENDING_HOST;
        List<Booking> bookings = bookingRepository.findByHostOrGuideIdAndStatusAndBookingType(
                providerProfileId, filterStatus, type);

        return bookings.stream().map(b -> toIncomingDto(b, providerProfileId, type)).collect(Collectors.toList());
    }

    /** Single round-trip for provider Bookings tab (accepted / confirmed / checked-in). */
    @Transactional(readOnly = true)
    public List<IncomingBookingDto> getActiveIncomingBookings(UUID providerUserId, BookingType type) {
        UUID providerProfileId = resolveProviderProfileId(providerUserId, type);
        List<BookingStatus> statuses = List.of(
                BookingStatus.ACCEPTED, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN);
        List<Booking> bookings = bookingRepository.findByHostOrGuideIdAndBookingTypeAndStatusIn(
                providerProfileId, type, statuses);
        return bookings.stream().map(b -> toIncomingDto(b, providerProfileId, type)).collect(Collectors.toList());
    }

    @Transactional
    public BookingDto acceptBooking(UUID bookingId, UUID providerUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        profileGateService.requireProviderCompleteForBooking(providerUserId, booking.getBookingType());
        verifyProvider(booking, providerUserId);

        if (booking.getBookingType() == BookingType.HOST) {
            int overlapping = countOverlappingHostStays(booking.getHostOrGuideId(), booking.getCheckIn(), booking.getCheckOut(), booking.getBookingId());
            if (overlapping >= MAX_OVERLAP) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have 2 guests for these dates.");
            }
            booking.setStatus(BookingStatus.ACCEPTED);
            bookingRepository.save(booking);
            autoDeclineOverlappingPending(booking);
        } else {
            int overlapping = countOverlappingGuideSessions(booking);
            if (overlapping >= MAX_OVERLAP) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have 2 sessions for this time slot.");
            }
            booking.setStatus(BookingStatus.ACCEPTED);
            bookingRepository.save(booking);
            autoDeclineOverlappingGuidePending(booking);
        }
        bookingNotificationService.onBookingAccepted(booking);
        return toDto(booking);
    }

    @Transactional
    public BookingDto declineBooking(UUID bookingId, UUID providerUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        verifyProvider(booking, providerUserId);
        booking.setStatus(BookingStatus.DECLINED);
        booking = bookingRepository.save(booking);
        bookingNotificationService.onBookingDeclined(booking);
        return toDto(booking);
    }

    @Transactional
    public BookingDto confirmBooking(UUID bookingId, UUID guestId) {
        profileGateService.requireEmailVerified(guestId);
        if (paystackEnabled && paystackSecretKey != null && !paystackSecretKey.isBlank()) {
            throw new IllegalArgumentException("Use the in-app payment flow for this booking.");
        }
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if (!booking.getGuestId().equals(guestId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized.");
        }
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalArgumentException("Booking must be accepted before payment.");
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus("PAID");
        booking = bookingRepository.save(booking);
        bookingNotificationService.onBookingConfirmed(booking);
        return toDto(booking);
    }

    @Transactional
    public BookingDto cancelBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if (!booking.getGuestId().equals(userId) && !isProviderUser(booking, userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return toDto(bookingRepository.save(booking));
    }

    private void autoDeclineOverlappingPending(Booking accepted) {
        List<Booking> pending = bookingRepository.findByHostOrGuideIdAndStatusAndBookingType(
                accepted.getHostOrGuideId(), BookingStatus.PENDING_HOST, BookingType.HOST);
        int overlapping = countOverlappingHostStays(accepted.getHostOrGuideId(), accepted.getCheckIn(), accepted.getCheckOut(), null);
        if (overlapping >= MAX_OVERLAP) {
            for (Booking p : pending) {
                if (p.getBookingId().equals(accepted.getBookingId())) continue;
                if (datesOverlap(p.getCheckIn(), p.getCheckOut(), accepted.getCheckIn(), accepted.getCheckOut())) {
                    p.setStatus(BookingStatus.DECLINED);
                    bookingRepository.save(p);
                }
            }
        }
    }

    private void autoDeclineOverlappingGuidePending(Booking accepted) {
        if (accepted.getSessionDate() == null) return;
        List<Booking> pending = bookingRepository.findPendingGuideSessionsOnDate(
                accepted.getHostOrGuideId(), accepted.getSessionDate());
        int overlapping = countOverlappingGuideSessions(accepted);
        if (overlapping >= MAX_OVERLAP) {
            for (Booking p : pending) {
                if (p.getBookingId().equals(accepted.getBookingId())) continue;
                if (sessionsOverlap(p, accepted)) {
                    p.setStatus(BookingStatus.DECLINED);
                    bookingRepository.save(p);
                }
            }
        }
    }

    private int countOverlappingHostStays(UUID hostProfileId, LocalDate checkIn, LocalDate checkOut, UUID excludeId) {
        List<Booking> overlapping = bookingRepository.findOverlappingHostStays(
                hostProfileId, BookingType.HOST, checkIn, checkOut);
        return (int) overlapping.stream()
                .filter(b -> excludeId == null || !b.getBookingId().equals(excludeId))
                .count();
    }

    private int countOverlappingGuideSessions(Booking candidate) {
        if (candidate.getSessionDate() == null) return 0;
        List<Booking> sameDay = bookingRepository.findPendingGuideSessionsOnDate(
                candidate.getHostOrGuideId(), candidate.getSessionDate());
        List<Booking> accepted = bookingRepository.findByHostOrGuideIdAndStatusAndBookingType(
                candidate.getHostOrGuideId(), BookingStatus.ACCEPTED, BookingType.GUIDE);
        List<Booking> confirmed = bookingRepository.findByHostOrGuideIdAndStatusAndBookingType(
                candidate.getHostOrGuideId(), BookingStatus.CONFIRMED, BookingType.GUIDE);
        List<Booking> all = new ArrayList<>();
        all.addAll(sameDay.stream().filter(b -> b.getStatus() == BookingStatus.ACCEPTED || b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.CHECKED_IN).toList());
        all.addAll(accepted);
        all.addAll(confirmed);
        return (int) all.stream()
                .filter(b -> !b.getBookingId().equals(candidate.getBookingId()))
                .filter(b -> sessionsOverlap(b, candidate))
                .count() + (candidate.getStatus() == BookingStatus.PENDING_HOST ? 0 : 0);
    }

    private boolean sessionsOverlap(Booking a, Booking b) {
        if (a.getSessionDate() == null || b.getSessionDate() == null) return false;
        if (!a.getSessionDate().equals(b.getSessionDate())) return false;
        LocalTime startA = parseTime(a.getSessionStartTime());
        LocalTime startB = parseTime(b.getSessionStartTime());
        double durA = a.getSessionDurationHours() != null ? a.getSessionDurationHours().doubleValue() : 3;
        double durB = b.getSessionDurationHours() != null ? b.getSessionDurationHours().doubleValue() : 3;
        long endA = startA.toSecondOfDay() + (long) (durA * 3600);
        long endB = startB.toSecondOfDay() + (long) (durB * 3600);
        long startAS = startA.toSecondOfDay();
        long startBS = startB.toSecondOfDay();
        return startAS < endB && startBS < endA;
    }

    private LocalTime parseTime(String t) {
        if (t == null || t.isBlank()) return LocalTime.of(9, 0);
        return LocalTime.parse(t.length() == 5 ? t : t.substring(0, 5));
    }

    private boolean datesOverlap(LocalDate inA, LocalDate outA, LocalDate inB, LocalDate outB) {
        return inA.isBefore(outB) && inB.isBefore(outA);
    }

    private UUID resolveProviderProfileId(UUID userId, BookingType type) {
        if (type == BookingType.GUIDE) {
            return guideProfileRepository.findByUserId(userId)
                    .map(GuideProfile::getGuideId)
                    .orElseThrow(() -> new IllegalArgumentException("Guide profile not found."));
        }
        return hostProfileRepository.findByUserId(userId)
                .map(HostProfile::getHostId)
                .orElseThrow(() -> new IllegalArgumentException("Host profile not found."));
    }

    private void verifyProvider(Booking booking, UUID providerUserId) {
        if (!isProviderUser(booking, providerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized.");
        }
    }

    private boolean isProviderUser(Booking booking, UUID userId) {
        if (booking.getBookingType() == BookingType.HOST) {
            return hostProfileRepository.findByUserId(userId)
                    .map(h -> h.getHostId().equals(booking.getHostOrGuideId()))
                    .orElse(false);
        }
        return guideProfileRepository.findByUserId(userId)
                .map(g -> g.getGuideId().equals(booking.getHostOrGuideId()))
                .orElse(false);
    }

    private IncomingBookingDto toIncomingDto(Booking b, UUID providerProfileId, BookingType type) {
        User guest = userRepository.findById(b.getGuestId()).orElse(null);
        Double compat = null;
        if (b.getMatchId() != null) {
            compat = matchRecordRepository.findById(b.getMatchId())
                    .map(m -> m.getCompatibilityScore().doubleValue())
                    .orElse(null);
        }
        String origin = guest != null ? guest.getNationality() : null;
        String university = null;
        Optional<SeekerProfile> seeker = seekerProfileRepository.findById(b.getGuestId());
        if (seeker.isPresent() && seeker.get().getProfileData() != null) {
            Object uni = seeker.get().getProfileData().get("university");
            if (uni != null) university = uni.toString();
        }

        int overlapping = 0;
        boolean canAccept = true;
        String declineReason = null;
        if (type == BookingType.HOST && b.getCheckIn() != null && b.getCheckOut() != null) {
            overlapping = countOverlappingHostStays(providerProfileId, b.getCheckIn(), b.getCheckOut(), null);
            canAccept = overlapping < MAX_OVERLAP;
            if (!canAccept) declineReason = "You already have 2 guests for these dates.";
        }

        long nights = 0;
        BigDecimal nightly = BigDecimal.ZERO;
        if (b.getCheckIn() != null && b.getCheckOut() != null) {
            nights = ChronoUnit.DAYS.between(b.getCheckIn(), b.getCheckOut());
            if (nights > 0 && b.getHostPayout() != null) {
                nightly = b.getHostPayout().divide(BigDecimal.valueOf(nights), 2, RoundingMode.HALF_UP);
            }
        }

        String guestName = guest != null ? guest.getFullName() : "Guest";
        return IncomingBookingDto.builder()
                .id(b.getBookingId())
                .bookingType(b.getBookingType())
                .seekerRole("STUDENT")
                .studentId(b.getGuestId())
                .studentName(guestName)
                .studentInitials(initials(guestName))
                .studentOrigin(origin)
                .studentUniversity(university)
                .compatibilityScore(compat)
                .checkIn(b.getCheckIn())
                .checkOut(b.getCheckOut())
                .sessionDate(b.getSessionDate())
                .sessionStartTime(b.getSessionStartTime())
                .sessionDurationHours(b.getSessionDurationHours())
                .message(b.getGuestMessage())
                .nightlyRate(nightly)
                .totalPrice(b.getTotalPrice())
                .platformFee(b.getPlatformFee())
                .nights((int) nights)
                .cancellationPolicy("FLEXIBLE")
                .overlappingAccepted(overlapping)
                .maxAllowed(MAX_OVERLAP)
                .canAccept(canAccept)
                .declineReason(declineReason)
                .build();
    }

    private BookingDto toDto(Booking b) {
        User guest = userRepository.findById(b.getGuestId()).orElse(null);
        String guestName = guest != null ? guest.getFullName() : "Guest";
        String providerName = resolveProviderName(b);
        return BookingDto.builder()
                .bookingId(b.getBookingId())
                .matchId(b.getMatchId())
                .guestId(b.getGuestId())
                .hostOrGuideId(b.getHostOrGuideId())
                .bookingType(b.getBookingType())
                .checkIn(b.getCheckIn())
                .checkOut(b.getCheckOut())
                .sessionDate(b.getSessionDate())
                .sessionStartTime(b.getSessionStartTime())
                .sessionDurationHours(b.getSessionDurationHours())
                .guestMessage(b.getGuestMessage())
                .totalPrice(b.getTotalPrice())
                .platformFee(b.getPlatformFee())
                .hostPayout(b.getHostPayout())
                .paymentStatus(b.getPaymentStatus())
                .status(b.getStatus())
                .guestName(guestName)
                .guestInitials(initials(guestName))
                .providerName(providerName)
                .build();
    }

    private String resolveProviderName(Booking booking) {
        UUID providerUserId = null;
        if (booking.getBookingType() == BookingType.HOST) {
            providerUserId = hostProfileRepository.findById(booking.getHostOrGuideId())
                    .map(HostProfile::getUserId)
                    .orElse(null);
        } else if (booking.getBookingType() == BookingType.GUIDE) {
            providerUserId = guideProfileRepository.findById(booking.getHostOrGuideId())
                    .map(GuideProfile::getUserId)
                    .orElse(null);
        }
        if (providerUserId == null) {
            return "Host";
        }
        return userRepository.findById(providerUserId)
                .map(User::getFullName)
                .filter(name -> name != null && !name.isBlank())
                .orElse("Host");
    }

    private String initials(String name) {
        if (name == null || name.isBlank()) return "??";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) return ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }
}
