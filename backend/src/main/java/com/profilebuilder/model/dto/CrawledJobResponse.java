package com.profilebuilder.model.dto;

import java.time.LocalDateTime;

/**
 * Response DTO for a crawled job listing.
 */
public record CrawledJobResponse(
        Long id,
        String title,
        String company,
        String location,
        String salaryInfo,
        LocalDateTime datePosted,
        String description,
        String sourceUrl,
        String sourceSite,
        LocalDateTime createdAt
) {}
