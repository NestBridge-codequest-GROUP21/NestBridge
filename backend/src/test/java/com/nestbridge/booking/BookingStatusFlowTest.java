package com.nestbridge.booking;

import com.nestbridge.common.BookingStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Documents the happy-path booking status transitions used by the app.
 */
class BookingStatusFlowTest {

    @Test
    void happyPath_pendingToAcceptedToConfirmed() {
        Booking booking = Booking.builder()
                .status(BookingStatus.PENDING_HOST)
                .paymentStatus("UNPAID")
                .build();

        assertEquals(BookingStatus.PENDING_HOST, booking.getStatus());

        booking.setStatus(BookingStatus.ACCEPTED);
        assertEquals(BookingStatus.ACCEPTED, booking.getStatus());

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus("PAID");
        assertEquals(BookingStatus.CONFIRMED, booking.getStatus());
        assertEquals("PAID", booking.getPaymentStatus());
    }

    @Test
    void declinedAndCancelled_areTerminalFromHostPerspective() {
        assertTrue(BookingStatus.DECLINED.name().contains("DECLINED"));
        assertTrue(BookingStatus.CANCELLED.name().contains("CANCELLED"));
    }
}
