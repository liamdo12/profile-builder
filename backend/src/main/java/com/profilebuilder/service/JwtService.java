package com.profilebuilder.service;

import com.profilebuilder.model.enums.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

/**
 * Handles JWT generation and validation.
 * Access tokens are short-lived (15 min), refresh tokens are long-lived (7 days).
 */
@Service
public class JwtService {

    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_REFRESH = "refresh";

    private final SecretKey signingKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtService(
            @Value("${app.jwt.secret}") String base64Secret,
            @Value("${app.jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${app.jwt.refresh-token-expiration}") long refreshTokenExpiration
    ) {
        this.signingKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(base64Secret));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    /**
     * Generates a short-lived access token containing the user's email and role.
     */
    public String generateAccessToken(String email, UserRole role) {
        return buildToken(email, Map.of(CLAIM_ROLE, role.name()), accessTokenExpiration);
    }

    /**
     * Generates a long-lived refresh token with type=refresh claim.
     */
    public String generateRefreshToken(String email) {
        return buildToken(email, Map.of(CLAIM_TYPE, TYPE_REFRESH), refreshTokenExpiration);
    }

    /**
     * Extracts the email (subject) from a token without validating expiry.
     */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Returns true if the token is valid (signature OK, not expired, not a refresh token).
     */
    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return !claims.getExpiration().before(new Date()) && !isRefreshToken(claims);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Returns true if the token is a refresh token (has type=refresh claim).
     */
    public boolean isRefreshToken(String token) {
        try {
            return isRefreshToken(parseClaims(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ── Private helpers ───────────────────────────────────────

    private boolean isRefreshToken(Claims claims) {
        return TYPE_REFRESH.equals(claims.get(CLAIM_TYPE, String.class));
    }

    private String buildToken(String subject, Map<String, Object> extraClaims, long expirationMs) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(subject)
                .claims(extraClaims)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
