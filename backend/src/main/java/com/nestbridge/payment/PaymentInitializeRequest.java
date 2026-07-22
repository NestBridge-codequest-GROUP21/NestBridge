package com.nestbridge.payment;

import lombok.Data;

import java.util.List;

@Data
public class PaymentInitializeRequest {
    /** Optional Paystack channels, e.g. mobile_money, card, bank_transfer. */
    private List<String> channels;
}
