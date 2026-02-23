package com.profilebuilder.ai.dto;

import com.profilebuilder.model.dto.RecommendationItem;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AI output DTO for the HR validator agent.
 * Contains scoring across 5 criteria plus gaps, strengths, and recommendations.
 */
@Data
@NoArgsConstructor
public class HrValidationOutput {

    private double overallScore;                // 0.0 - 10.0 (weighted composite)
    private double keywordMatchScore;           // 0.0 - 1.0
    private double experienceRelevanceScore;    // 0.0 - 1.0
    private double skillsAlignmentScore;        // 0.0 - 1.0
    private double resumeQualityScore;          // 0.0 - 1.0
    private double educationFitScore;           // 0.0 - 1.0
    private List<String> gaps;
    private List<String> strengths;
    private List<RecommendationItem> recommendations;
}
