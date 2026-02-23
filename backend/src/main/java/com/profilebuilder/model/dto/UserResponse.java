package com.profilebuilder.model.dto;

import com.profilebuilder.model.enums.UserRole;

/**
 * Public user representation returned in API responses.
 * Never exposes passwordHash or internal fields.
 */
public record UserResponse(
        Long id,
        String email,
        String username,
        UserRole role
) {}
