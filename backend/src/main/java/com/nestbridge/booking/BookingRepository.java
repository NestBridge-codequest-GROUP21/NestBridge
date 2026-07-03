package com.nestbridge.booking;

import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.BookingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByGuestIdOrderByCreatedAtDesc(UUID guestId);

    @Query("""
            SELECT b FROM Booking b WHERE b.hostOrGuideId = :hostOrGuideId
            AND b.status = :status ORDER BY b.createdAt DESC
            """)
    List<Booking> findByHostOrGuideIdAndStatusOrderByCreatedAtDesc(
            @Param("hostOrGuideId") UUID hostOrGuideId,
            @Param("status") BookingStatus status);

    @Query("""
            SELECT b FROM Booking b WHERE b.hostOrGuideId = :providerId
            AND b.bookingType = :type
            AND b.status IN (com.nestbridge.common.BookingStatus.ACCEPTED, com.nestbridge.common.BookingStatus.CONFIRMED, com.nestbridge.common.BookingStatus.CHECKED_IN)
            AND b.checkIn < :checkOut AND b.checkOut > :checkIn
            """)
    List<Booking> findOverlappingHostStays(
            @Param("providerId") UUID providerId,
            @Param("type") BookingType type,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut);

    @Query("""
            SELECT b FROM Booking b WHERE b.hostOrGuideId = :hostOrGuideId
            AND b.status = :status AND b.bookingType = :bookingType
            """)
    List<Booking> findByHostOrGuideIdAndStatusAndBookingType(
            @Param("hostOrGuideId") UUID hostOrGuideId,
            @Param("status") BookingStatus status,
            @Param("bookingType") BookingType bookingType);

    @Query("""
            SELECT b FROM Booking b WHERE b.hostOrGuideId = :providerId
            AND b.bookingType = com.nestbridge.common.BookingType.GUIDE
            AND b.status = com.nestbridge.common.BookingStatus.PENDING_HOST
            AND b.sessionDate = :sessionDate
            """)
    List<Booking> findPendingGuideSessionsOnDate(
            @Param("providerId") UUID providerId,
            @Param("sessionDate") LocalDate sessionDate);
}
