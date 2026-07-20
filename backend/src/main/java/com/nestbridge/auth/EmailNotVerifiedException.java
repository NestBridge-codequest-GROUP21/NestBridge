package com.nestbridge.auth;

public class EmailNotVerifiedException extends RuntimeException {

    public EmailNotVerifiedException() {
        super("Your email has not yet been verified. Please verify your email before signing in.");
    }
}
