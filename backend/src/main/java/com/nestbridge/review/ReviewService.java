package com.nestbridge.review;

import com.nestbridge.booking.Booking;
import com.nestbridge.booking.BookingRepository;
import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.BookingType;
import com.nestbridge.guide.GuideProfile;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.host.HostProfile;
import com.nestbridge.host.HostProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private static final EnumSet<BookingStatus> REVIEWABLE_STATUSES = EnumSet.of(
            BookingStatus.ACCEPTED,
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN);

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;

    @Transactional
    public ReviewDto submitReview(UUID reviewerId, UUID bookingId, SubmitReviewRequest request) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        if (!booking.getGuestId().equals(reviewerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the guest can review this booking.");
        }
        if (!REVIEWABLE_STATUSES.contains(booking.getStatus())) {
            throw new IllegalArgumentException("This booking is not ready for a review yet.");
        }
        if (reviewRepository.findByBookingIdAndReviewerId(bookingId, reviewerId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already submitted a review for this booking.");
        }

        String revieweeType = booking.getBookingType() == BookingType.HOST ? "HOST" : "GUIDE";
        UUID revieweeProfileId = booking.getHostOrGuideId();

        Review review = Review.builder()
                .bookingId(bookingId)
                .reviewerId(reviewerId)
                .revieweeProfileId(revieweeProfileId)
                .revieweeType(revieweeType)
                .rating(request.getRating())
                .comment(request.getComment())
                .status("PUBLISHED")
                .build();
        review = reviewRepository.save(review);
        refreshRevieweeRatings(revieweeProfileId, revieweeType);
        return toDto(review);
    }

    private void refreshRevieweeRatings(UUID profileId, String revieweeType) {
        long count = reviewRepository.countByRevieweeProfileIdAndRevieweeTypeAndStatus(
                profileId, revieweeType, "PUBLISHED");
        BigDecimal average = reviewRepository.averageRatingForReviewee(profileId, revieweeType)
                .map(value -> BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP))
                .orElse(BigDecimal.ZERO);

        if ("HOST".equals(revieweeType)) {
            HostProfile host = hostProfileRepository.findById(profileId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Host profile not found."));
            host.setReviewCount((int) count);
            host.setAverageRating(average);
            hostProfileRepository.save(host);
            return;
        }

        GuideProfile guide = guideProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guide profile not found."));
        guide.setReviewCount((int) count);
        guide.setAverageRating(average);
        guideProfileRepository.save(guide);
    }

    private ReviewDto toDto(Review review) {
        return ReviewDto.builder()
                .reviewId(review.getReviewId().toString())
                .bookingId(review.getBookingId().toString())
                .rating(review.getRating())
                .comment(review.getComment())
                .status(review.getStatus())
                .build();
    }
}
