package com.profilebuilder.model.dto;

/**
 * Response returned after successful login or register.
 * Contains both access token (short-lived) and refresh token (long-lived).
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {}
