package com.nestbridge.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Returns 401 (not Spring's default 403) when a request reaches a protected
 * endpoint without valid authentication — i.e. a missing, expired, or invalid
 * JWT. The mobile client's response interceptor listens for 401 to trigger its
 * token-refresh + retry flow, so returning 401 here is what makes silent token
 * renewal work instead of the user getting stuck on a 403.
 *
 * The body mirrors the {@code ApiResponse} shape the client already parses so
 * error messages surface consistently.
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"success\":false,\"message\":\"Your session has expired. Please sign in again.\",\"data\":null}");
    }
}
