package com.nestbridge.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Optional<Review> findByBookingIdAndReviewerId(UUID bookingId, UUID reviewerId);

    long countByRevieweeProfileIdAndRevieweeTypeAndStatus(
            UUID revieweeProfileId, String revieweeType, String status);

    @Query("""
            SELECT AVG(r.rating) FROM Review r
            WHERE r.revieweeProfileId = :profileId
              AND r.revieweeType = :revieweeType
              AND r.status = 'PUBLISHED'
            """)
    Optional<Double> averageRatingForReviewee(
            @Param("profileId") UUID profileId,
            @Param("revieweeType") String revieweeType);
}
