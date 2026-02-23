package com.profilebuilder.model.dto;

import com.profilebuilder.model.enums.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Request body for updating a user's role (admin operation).
 */
@Getter
@Setter
public class UpdateUserRoleRequest {

    @NotNull
    private UserRole role;
}
