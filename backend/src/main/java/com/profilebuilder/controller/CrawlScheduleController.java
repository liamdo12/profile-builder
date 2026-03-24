package com.profilebuilder.controller;

import com.profilebuilder.model.dto.CrawlScheduleRequest;
import com.profilebuilder.model.dto.CrawlScheduleResponse;
import com.profilebuilder.model.entity.User;
import com.profilebuilder.service.CrawlScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Crawl schedule configuration endpoints.
 * Restricted to PREMIUM+ roles.
 */
@RestController
@RequestMapping("/api/crawl-schedule")
@PreAuthorize("hasAnyRole('PREMIUM','ADMIN')")
public class CrawlScheduleController {

    private final CrawlScheduleService service;

    public CrawlScheduleController(CrawlScheduleService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<CrawlScheduleResponse> get(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getOrCreate(user.getId()));
    }

    @PutMapping
    public ResponseEntity<CrawlScheduleResponse> update(
            @Valid @RequestBody CrawlScheduleRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.update(req, user.getId()));
    }
}
