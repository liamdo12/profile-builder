package com.profilebuilder.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating crawl schedule settings.
 */
@Data
@NoArgsConstructor
public class CrawlScheduleRequest {

    @Min(value = 1, message = "Interval must be at least 1 hour")
    @Max(value = 24, message = "Interval must be at most 24 hours")
    private Integer intervalHours;

    private Boolean enabled;
}
