package com.profilebuilder.exception;

/**
 * Thrown when authentication fails (invalid credentials, expired token, etc.).
 * Mapped to HTTP 401 Unauthorized by GlobalExceptionHandler.
 */
public class AuthenticationException extends RuntimeException {

    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
