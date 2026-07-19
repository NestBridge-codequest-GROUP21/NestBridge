package com.nestbridge.lodging;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lodging")
@RequiredArgsConstructor
public class LodgingController {

    private final LodgingService lodgingService;

    @GetMapping("/partners")
    public ResponseEntity<ApiResponse<List<LodgingPartnerDto>>> getPartners(
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(ApiResponse.success("Lodging partners retrieved", lodgingService.getPartners(city)));
    }
}
