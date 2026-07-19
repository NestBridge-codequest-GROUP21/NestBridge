package com.nestbridge.matching;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping("/find")
    public ResponseEntity<ApiResponse<List<MatchResultDto>>> findMatches(
            Authentication authentication,
            @RequestBody MatchFindRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        List<MatchResultDto> results = matchService.findMatches(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Matches found", results));
    }
}
