package com.nestbridge.host;

import com.nestbridge.booking.Booking;
import com.nestbridge.booking.BookingRepository;
import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.BookingType;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class HostService {

    private static final DateTimeFormatter MONTH_DAY = DateTimeFormatter.ofPattern("MMM d");

    private final HostProfileRepository hostProfileRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public HostProfileDto getById(UUID hostId) {
        HostProfile host = hostProfileRepository.findById(hostId)
                .orElseThrow(() -> new IllegalArgumentException("Host not found."));
        User user = userRepository.findById(host.getUserId()).orElse(null);
        return toDto(host, user, null, null);
    }

    @Transactional(readOnly = true)
    public HostProfileDto getMyProfile(UUID userId) {
        HostProfile host = hostProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Host profile not found."));
        User user = userRepository.findById(userId).orElse(null);
        return toDto(host, user, null, null);
    }

    @Transactional
    public HostProfileDto upsertProfile(UUID userId, HostProfileRequest request) {
        HostProfile host = hostProfileRepository.findByUserId(userId)
                .orElse(HostProfile.builder().userId(userId).active(false).build());
        applyRequest(host, request);
        host = hostProfileRepository.save(host);
        User user = userRepository.findById(userId).orElse(null);
        return toDto(host, user, null, null);
    }

    @Transactional(readOnly = true)
    public List<HostCalendarDayDto> getMyCalendar(UUID userId, int year, int month) {
        HostProfile host = hostProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Host profile not found."));
        LocalDate monthStart = LocalDate.of(year, month, 1);
        LocalDate monthEndExclusive = monthStart.plusMonths(1);

        Set<LocalDate> bookedDates = new HashSet<>();
        for (Booking booking : bookingRepository.findActiveHostStaysOverlappingMonth(
                host.getHostId(), monthStart, monthEndExclusive)) {
            LocalDate cursor = booking.getCheckIn();
            while (cursor != null && cursor.isBefore(booking.getCheckOut()) && cursor.isBefore(monthEndExclusive)) {
                if (!cursor.isBefore(monthStart)) {
                    bookedDates.add(cursor);
                }
                cursor = cursor.plusDays(1);
            }
        }

        Map<String, Object> calendar = host.getAvailabilityCalendar() != null
                ? host.getAvailabilityCalendar()
                : Collections.emptyMap();
        int daysInMonth = monthStart.lengthOfMonth();
        List<HostCalendarDayDto> days = new ArrayList<>(daysInMonth);
        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = LocalDate.of(year, month, day);
            String status = "available";
            if (bookedDates.contains(date)) {
                status = "booked";
            } else {
                Object stored = calendar.get(date.toString());
                if ("blocked".equals(stored)) {
                    status = "blocked";
                }
            }
            days.add(HostCalendarDayDto.builder()
                    .date(date.toString())
                    .day(day)
                    .status(status)
                    .build());
        }
        return days;
    }

    @Transactional(readOnly = true)
    public HostActiveBookingDto getMyActiveBooking(UUID userId) {
        HostProfile host = hostProfileRepository.findByUserId(userId).orElse(null);
        if (host == null) {
            return null;
        }
        for (BookingStatus status : List.of(BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN, BookingStatus.ACCEPTED)) {
            List<Booking> bookings = bookingRepository.findByHostOrGuideIdAndStatusAndBookingType(
                    host.getHostId(), status, BookingType.HOST);
            if (!bookings.isEmpty()) {
                return toActiveBooking(bookings.get(0));
            }
        }
        return null;
    }

    static HostProfileDto toDto(HostProfile host, User user, Integer matchPct, java.util.List<String> reasons) {
        String name = user != null ? user.getFullName() : "Host";
        String initials = name.length() >= 2
                ? name.substring(0, 2).toUpperCase()
                : name.toUpperCase();
        return HostProfileDto.builder()
                .hostId(host.getHostId())
                .userId(host.getUserId())
                .hostName(name)
                .initials(initials)
                .address(host.getAddress())
                .city(host.getCity())
                .country(host.getCountry())
                .lat(host.getLat())
                .lng(host.getLng())
                .roomType(host.getRoomType())
                .maxGuests(host.getMaxGuests())
                .pricePerNight(host.getPricePerNight())
                .amenities(host.getAmenities())
                .houseRules(host.getHouseRules())
                .dietOffered(host.getDietOffered())
                .cancellationPolicy(host.getCancellationPolicy())
                .photos(host.getPhotos())
                .active(host.isActive())
                .reviewCount(host.getReviewCount())
                .averageRating(host.getAverageRating())
                .availabilityCalendar(host.getAvailabilityCalendar())
                .matchPercentage(matchPct)
                .matchReasons(reasons)
                .build();
    }

    private HostActiveBookingDto toActiveBooking(Booking booking) {
        User guest = userRepository.findById(booking.getGuestId()).orElse(null);
        String guestName = guest != null ? guest.getFullName() : "Guest";
        String dateRange = "%s – %s".formatted(
                booking.getCheckIn().format(MONTH_DAY),
                booking.getCheckOut().format(MONTH_DAY));
        String totalAmount = booking.getTotalPrice() != null
                ? "GHS %s".formatted(booking.getTotalPrice().setScale(0, RoundingMode.HALF_UP))
                : "GHS —";
        return HostActiveBookingDto.builder()
                .guestName(guestName)
                .dateRange(dateRange)
                .totalAmount(totalAmount)
                .build();
    }

    private void applyRequest(HostProfile host, HostProfileRequest request) {
        if (request.getAddress() != null) host.setAddress(request.getAddress());
        if (request.getCity() != null) host.setCity(request.getCity());
        if (request.getCountry() != null) host.setCountry(request.getCountry());
        if (request.getLat() != null) host.setLat(request.getLat());
        if (request.getLng() != null) host.setLng(request.getLng());
        if (request.getRoomType() != null) host.setRoomType(request.getRoomType());
        if (request.getMaxGuests() != null) host.setMaxGuests(request.getMaxGuests());
        if (request.getPricePerNight() != null) host.setPricePerNight(request.getPricePerNight());
        if (request.getAmenities() != null) host.setAmenities(request.getAmenities());
        if (request.getHouseRules() != null) host.setHouseRules(request.getHouseRules());
        if (request.getDietOffered() != null) host.setDietOffered(request.getDietOffered());
        if (request.getCancellationPolicy() != null) host.setCancellationPolicy(request.getCancellationPolicy());
        if (request.getPhotos() != null) host.setPhotos(request.getPhotos());
        if (request.getActive() != null) host.setActive(request.getActive());
        if (request.getAvailabilityCalendar() != null) host.setAvailabilityCalendar(request.getAvailabilityCalendar());
    }
}
