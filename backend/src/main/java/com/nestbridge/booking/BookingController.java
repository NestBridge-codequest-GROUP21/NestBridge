package com.nestbridge.booking;

import com.nestbridge.common.ApiResponse;
import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.BookingType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> create(
            Authentication authentication,
            @RequestBody CreateBookingRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Booking request created", bookingService.createBooking(userId, request)));
    }

    @GetMapping("/incoming")
    public ResponseEntity<ApiResponse<List<IncomingBookingDto>>> incoming(
            Authentication authentication,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false, defaultValue = "HOST") BookingType bookingType) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Incoming bookings", bookingService.getIncomingBookings(userId, status, bookingType)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDto>> get(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Booking details", bookingService.getBooking(id, userId)));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<BookingDto>> accept(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Booking accepted", bookingService.acceptBooking(id, userId)));
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<ApiResponse<BookingDto>> decline(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Booking declined", bookingService.declineBooking(id, userId)));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<BookingDto>> confirm(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed", bookingService.confirmBooking(id, userId)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingDto>> cancel(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", bookingService.cancelBooking(id, userId)));
    }
}
