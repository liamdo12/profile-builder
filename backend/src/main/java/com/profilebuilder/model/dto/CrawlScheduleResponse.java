package com.profilebuilder.model.dto;

import java.time.LocalDateTime;

/**
 * Response DTO for crawl schedule configuration.
 */
public record CrawlScheduleResponse(
        Long id,
        Integer intervalHours,
        Boolean enabled,
        LocalDateTime lastCrawlAt,
        LocalDateTime nextCrawlAt
) {}
