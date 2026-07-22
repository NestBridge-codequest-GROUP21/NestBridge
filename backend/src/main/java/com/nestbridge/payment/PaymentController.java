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
            @PathVariable UUID id,
            @RequestBody(required = false) PaymentInitializeRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Payment initialized",
                paystackService.initializePayment(
                        id,
                        userId,
                        request != null ? request.getChannels() : null)));
    }

    /**
     * Confirm Paystack payment after the guest returns from checkout.
     * Never marks paid without a successful Paystack verify (or prior SUCCESS record).
     */
    @PostMapping("/{id}/payment/verify")
    public ResponseEntity<ApiResponse<PaymentVerifyResponse>> verify(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        PaymentVerifyResponse result = paystackService.verifyPaymentForGuest(id, userId);
        String message = result.getMessage() != null ? result.getMessage() : "Payment checked.";
        return ResponseEntity.ok(ApiResponse.success(message, result));
    }
}
