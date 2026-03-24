package com.profilebuilder.controller;

import com.profilebuilder.model.dto.CrawledJobResponse;
import com.profilebuilder.model.entity.User;
import com.profilebuilder.service.CrawledJobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Endpoints for listing crawled jobs, manual crawl trigger, and deletion.
 * Restricted to PREMIUM+ roles.
 */
@RestController
@RequestMapping("/api/crawled-jobs")
@PreAuthorize("hasAnyRole('PREMIUM','ADMIN')")
public class CrawledJobController {

    private final CrawledJobService service;

    public CrawledJobController(CrawledJobService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<CrawledJobResponse>> list(
            @RequestParam(required = false) String sourceSite,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listByUser(user.getId(), sourceSite, pageable));
    }

    @PostMapping("/crawl-now")
    public ResponseEntity<Map<String, String>> crawlNow(@AuthenticationPrincipal User user) {
        service.triggerCrawlNow(user.getId());
        return ResponseEntity.accepted().body(Map.of("message", "Crawl triggered"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        service.delete(id, user.getId());
        return ResponseEntity.ok().build();
    }
}
