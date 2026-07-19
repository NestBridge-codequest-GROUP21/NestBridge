package com.nestbridge.payment;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class PaymentController {

    private final PaystackService paystackService;

    @PostMapping("/{id}/payment/initialize")
    public ResponseEntity<ApiResponse<PaymentInitializeResponse>> initialize(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Payment initialized",
                paystackService.initializePayment(id, userId)));
    }
}
