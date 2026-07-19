package com.nestbridge.auth;

public class EmailNotVerifiedException extends RuntimeException {

    public EmailNotVerifiedException() {
        super("Please verify your email before signing in.");
    }
}
