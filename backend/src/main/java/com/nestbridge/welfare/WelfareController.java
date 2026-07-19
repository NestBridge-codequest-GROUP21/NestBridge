package com.nestbridge.welfare;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/welfare")
@RequiredArgsConstructor
public class WelfareController {

    private final WelfareService welfareService;

    @PostMapping("/sos")
    public ResponseEntity<ApiResponse<SosEventDto>> logSos(
            Authentication authentication,
            @RequestBody SosRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("SOS logged", welfareService.logSos(userId, request)));
    }

    @GetMapping("/checkins/{bookingId}")
    public ResponseEntity<ApiResponse<List<WelfareCheckInDto>>> getCheckIns(
            Authentication authentication,
            @PathVariable UUID bookingId) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(
                ApiResponse.success("Check-ins retrieved", welfareService.getCheckInsForBooking(bookingId, userId)));
    }

    @PostMapping("/checkins/{bookingId}")
    public ResponseEntity<ApiResponse<WelfareCheckInDto>> submitCheckIn(
            Authentication authentication,
            @PathVariable UUID bookingId,
            @RequestBody SubmitWelfareCheckInRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(
                ApiResponse.success("Check-in saved", welfareService.submitCheckIn(userId, bookingId, request)));
    }
}
