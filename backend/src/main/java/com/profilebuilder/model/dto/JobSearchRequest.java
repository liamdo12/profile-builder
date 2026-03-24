package com.profilebuilder.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating/updating a job search configuration.
 */
@Data
@NoArgsConstructor
public class JobSearchRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 255, message = "Job title must be at most 255 characters")
    private String jobTitle;

    @Size(max = 255, message = "Location must be at most 255 characters")
    private String location;

    private Boolean remoteOnly = false;

    @Min(value = 1, message = "Date filter must be at least 1 day")
    @Max(value = 30, message = "Date filter must be at most 30 days")
    private Integer datePostedWithinDays = 3;
}
