package com.nestbridge.payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentVerifyResponse {

    private boolean paid;
    private String reference;
    private String bookingStatus;
    private String paymentStatus;
    private String message;
}
