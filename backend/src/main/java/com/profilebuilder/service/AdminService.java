package com.profilebuilder.service;

import com.profilebuilder.exception.ResourceNotFoundException;
import com.profilebuilder.model.dto.UserResponse;
import com.profilebuilder.model.entity.User;
import com.profilebuilder.model.enums.UserRole;
import com.profilebuilder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for admin operations: listing users and updating user roles.
 */
@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns all registered users as public response DTOs.
     */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .toList();
    }

    /**
     * Returns a single user by ID, or throws ResourceNotFoundException.
     */
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toUserResponse(user);
    }

    /**
     * Updates the role of an existing user and returns the updated representation.
     */
    public UserResponse updateUserRole(Long id, UserRole role, Long currentAdminId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getId().equals(currentAdminId) && role != UserRole.ADMIN) {
            throw new IllegalArgumentException("Cannot demote yourself");
        }

        user.setRole(role);
        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    // ── Private helpers ──────────────────────────────────────

    private UserResponse toUserResponse(User user) {
        // getUsername() returns email (Spring Security contract); getDisplayUsername() returns human-readable username
        return new UserResponse(user.getId(), user.getEmail(), user.getDisplayUsername(), user.getRole());
    }
}
