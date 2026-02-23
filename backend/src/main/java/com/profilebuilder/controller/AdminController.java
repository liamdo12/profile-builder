package com.profilebuilder.controller;

import com.profilebuilder.model.dto.UpdateUserRoleRequest;
import com.profilebuilder.model.dto.UserResponse;
import com.profilebuilder.service.AdminService;
import com.profilebuilder.model.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for admin-only user management operations.
 * Restricted to ADMIN role via @PreAuthorize at class level.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * GET /api/admin/users
     * Returns a list of all registered users.
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    /**
     * GET /api/admin/users/{id}
     * Returns a single user by ID.
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    /**
     * PUT /api/admin/users/{id}/role
     * Updates the role of a user. Accepts {@link UpdateUserRoleRequest} body.
     */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUserRoleRequest request,
            @AuthenticationPrincipal User currentAdmin) {

        return ResponseEntity.ok(adminService.updateUserRole(id, request.getRole(), currentAdmin.getId()));
    }
}
