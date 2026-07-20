package com.nestbridge.recommendation;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class HomeRecommendationsDto {
    private String city;
    private String role;
    private String headline;
    private List<RecommendationSectionDto> sections;
}
