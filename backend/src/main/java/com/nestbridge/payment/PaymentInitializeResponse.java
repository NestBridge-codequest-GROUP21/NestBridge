package com.nestbridge.payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentInitializeResponse {

    private boolean mockPayment;
    private String authorizationUrl;
    private String reference;
}
