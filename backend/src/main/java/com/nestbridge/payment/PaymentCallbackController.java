package com.nestbridge.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Browser return URL after Paystack checkout ({@code APP_PUBLIC_URL}/api/payments/callback).
 * Confirms the booking once Paystack reports a successful charge.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentCallbackController {

    private final PaystackService paystackService;

    @GetMapping(value = "/callback", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> callback(
            @RequestParam(value = "reference", required = false) String reference,
            @RequestParam(value = "trxref", required = false) String trxref) {
        String ref = reference != null && !reference.isBlank() ? reference : trxref;
        boolean paid = paystackService.verifyAndCompleteByReference(ref);

        String title = paid ? "Payment successful" : "Payment not confirmed yet";
        String body = paid
                ? "Your NestBridge booking is confirmed. You can close this page and return to the app."
                : "We could not confirm this payment yet. Return to the NestBridge app and pull to refresh Bookings. "
                        + "If you were charged, confirmation usually appears within a minute.";

        String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1"/>
                  <title>%s — NestBridge</title>
                  <style>
                    body { font-family: system-ui, sans-serif; margin: 0; padding: 2rem;
                           background: #0B1F33; color: #F7F4EF; text-align: center; }
                    h1 { font-size: 1.4rem; margin-bottom: 0.75rem; }
                    p { color: #C5D0D8; line-height: 1.5; max-width: 28rem; margin: 0 auto; }
                  </style>
                </head>
                <body>
                  <h1>%s</h1>
                  <p>%s</p>
                </body>
                </html>
                """.formatted(title, title, body);

        return ResponseEntity.ok(html);
    }
}
