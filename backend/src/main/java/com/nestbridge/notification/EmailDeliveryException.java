package com.nestbridge.notification;

/**
 * Raised when outbound email cannot be delivered (missing config or provider failure).
 */
public class EmailDeliveryException extends RuntimeException {

    public EmailDeliveryException(String message) {
        super(message);
    }

    public EmailDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
