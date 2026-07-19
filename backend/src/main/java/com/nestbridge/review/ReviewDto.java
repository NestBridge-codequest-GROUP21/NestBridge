package com.nestbridge.review;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewDto {

    private String reviewId;
    private String bookingId;
    private int rating;
    private String comment;
    private String status;
}
