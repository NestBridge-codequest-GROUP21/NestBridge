package com.nestbridge.recommendation;

import com.nestbridge.common.ApiResponse;
import com.nestbridge.common.GhanaReference;
import com.nestbridge.common.PrimaryIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<HomeRecommendationsDto>> home(
            Authentication authentication,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String role
    ) {
        UUID userId = UUID.fromString(authentication.getName());
        PrimaryIntent intentOverride = null;
        if (role != null && !role.isBlank()) {
            try {
                intentOverride = PrimaryIntent.valueOf(role.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {
                // keep profile intent
            }
        }
        String normalized = city != null && !city.isBlank()
                ? GhanaReference.normalizeCity(city)
                : null;
        HomeRecommendationsDto dto = recommendationService.homeForUser(userId, normalized, intentOverride);
        return ResponseEntity.ok(ApiResponse.success("Recommendations ready.", dto));
    }
}
