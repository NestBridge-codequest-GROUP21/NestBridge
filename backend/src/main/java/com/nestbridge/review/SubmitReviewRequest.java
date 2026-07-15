package com.nestbridge.review;

import lombok.Data;

@Data
public class SubmitReviewRequest {

    private int rating;
    private String comment;
}
