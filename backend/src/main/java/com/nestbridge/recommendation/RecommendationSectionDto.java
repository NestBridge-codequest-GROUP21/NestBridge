package com.nestbridge.recommendation;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecommendationSectionDto {
    private String id;
    private String title;
    /** list | grid */
    private String layout;
    private List<RecommendationItemDto> items;
}
