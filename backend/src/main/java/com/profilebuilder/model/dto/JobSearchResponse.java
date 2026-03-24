package com.profilebuilder.model.dto;

import java.time.LocalDateTime;

/**
 * Response DTO for job search configuration.
 */
public record JobSearchResponse(
        Long id,
        String jobTitle,
        String location,
        Boolean remoteOnly,
        Integer datePostedWithinDays,
        Boolean enabled,
        LocalDateTime createdAt
) {}
