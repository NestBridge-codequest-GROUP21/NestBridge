package com.nestbridge.payment;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PaystackAmountTest {

    @Test
    void convertsGhsToPesewas() {
        long pesewas = BigDecimal.valueOf(150.50)
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
        assertEquals(15050L, pesewas);
    }
}
