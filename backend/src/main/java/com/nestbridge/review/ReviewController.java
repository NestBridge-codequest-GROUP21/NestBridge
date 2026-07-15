package com.nestbridge.review;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/bookings/{bookingId}")
    public ResponseEntity<ApiResponse<ReviewDto>> submitReview(
            Authentication authentication,
            @PathVariable UUID bookingId,
            @RequestBody SubmitReviewRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(
                ApiResponse.success("Review submitted", reviewService.submitReview(userId, bookingId, request)));
    }
}
