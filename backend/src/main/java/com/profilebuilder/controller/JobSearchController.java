package com.profilebuilder.controller;

import com.profilebuilder.model.dto.JobSearchRequest;
import com.profilebuilder.model.dto.JobSearchResponse;
import com.profilebuilder.model.entity.User;
import com.profilebuilder.service.JobSearchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CRUD endpoints for user job search configurations.
 * Restricted to PREMIUM+ roles.
 */
@RestController
@RequestMapping("/api/job-searches")
@PreAuthorize("hasAnyRole('PREMIUM','ADMIN')")
public class JobSearchController {

    private final JobSearchService service;

    public JobSearchController(JobSearchService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<JobSearchResponse> create(
            @Valid @RequestBody JobSearchRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.create(req, user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<JobSearchResponse>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listByUser(user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobSearchResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody JobSearchRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.update(id, req, user.getId()));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggle(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        service.toggleEnabled(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        service.delete(id, user.getId());
        return ResponseEntity.ok().build();
    }
}
