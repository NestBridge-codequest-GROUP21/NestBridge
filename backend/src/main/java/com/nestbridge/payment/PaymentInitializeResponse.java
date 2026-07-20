package com.nestbridge.payment;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentInitializeResponse {

    private boolean mockPayment;
    private String authorizationUrl;
    private String reference;
    private String bookingId;
    private BigDecimal amount;
    private String currency;
}
