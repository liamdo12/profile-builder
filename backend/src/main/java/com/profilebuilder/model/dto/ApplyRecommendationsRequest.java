package com.profilebuilder.model.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request body for the apply-recommendations endpoint.
 * Contains the list of HR recommendations to apply to an existing smart resume.
 */
@Data
@NoArgsConstructor
public class ApplyRecommendationsRequest {

    @NotEmpty(message = "Recommendations list must not be empty")
    private List<RecommendationItem> recommendations;
}
