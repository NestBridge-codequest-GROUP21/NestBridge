package com.nestbridge.community;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    /**
     * Students and host families in the same city as the signed-in seeker
     * (or an explicit {@code city} override).
     */
    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<NearbyCommunityDto>> nearby(
            Authentication authentication,
            @RequestParam(required = false) String city) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Nearby community loaded",
                communityService.nearby(userId, city)));
    }
}
