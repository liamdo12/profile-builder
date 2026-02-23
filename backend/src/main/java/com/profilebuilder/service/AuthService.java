package com.profilebuilder.service;

import com.profilebuilder.exception.AuthenticationException;
import com.profilebuilder.model.dto.AuthResponse;
import com.profilebuilder.model.dto.LoginRequest;
import com.profilebuilder.model.dto.RegisterRequest;
import com.profilebuilder.model.dto.UserResponse;
import com.profilebuilder.model.entity.User;
import com.profilebuilder.model.enums.UserRole;
import com.profilebuilder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles user registration, login, and token refresh.
 * No password reset — excluded from MVP.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new user with BASIC role and returns auth tokens.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new AuthenticationException("Email is already in use");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new AuthenticationException("Username is already taken");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setUsername(request.username());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.BASIC);

        User saved = userRepository.save(user);
        return buildAuthResponse(saved);
    }

    /**
     * Authenticates user credentials and returns auth tokens.
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    /**
     * Validates a refresh token and issues a fresh token pair.
     */
    public AuthResponse refresh(String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken) || !jwtService.isRefreshToken(refreshToken)) {
            throw new AuthenticationException("Invalid or expired refresh token");
        }

        String email = jwtService.extractEmail(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        return buildAuthResponse(user);
    }

    /**
     * Returns the public profile of the currently authenticated user.
     */
    public UserResponse getCurrentUser(User user) {
        return toUserResponse(user);
    }

    // ── Private helpers ───────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
        return new AuthResponse(accessToken, refreshToken, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayUsername(),
                user.getRole()
        );
    }
}
