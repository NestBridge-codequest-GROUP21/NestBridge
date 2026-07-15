package com.nestbridge.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory rate limiter for auth endpoints (per client IP).
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int LOGIN_LIMIT = 20;
    private static final int REGISTER_LIMIT = 10;
    private static final int RESEND_LIMIT = 5;
    private static final long WINDOW_MS = 60_000;

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (!path.startsWith("/api/auth/")) {
            return true;
        }
        String method = request.getMethod();
        if (!"POST".equalsIgnoreCase(method)) {
            return true;
        }
        return !(path.endsWith("/login")
                || path.endsWith("/register")
                || path.endsWith("/resend-verification"));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        int limit = path.endsWith("/register") ? REGISTER_LIMIT
                : path.endsWith("/resend-verification") ? RESEND_LIMIT
                : LOGIN_LIMIT;

        String key = clientIp(request) + ":" + path;
        long now = Instant.now().toEpochMilli();
        Window window = windows.compute(key, (k, existing) -> {
            if (existing == null || now - existing.startMs > WINDOW_MS) {
                return new Window(now, 1);
            }
            existing.count++;
            return existing;
        });

        if (window.count > limit) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Too many attempts. Please wait a minute and try again.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static final class Window {
        final long startMs;
        int count;

        Window(long startMs, int count) {
            this.startMs = startMs;
            this.count = count;
        }
    }
}
