package com.profilebuilder.model.dto;

import com.profilebuilder.ai.dto.SmartResumeOutput;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for smart resume generation endpoints.
 * Contains the generated resume content and optional HR validation scores.
 */
@Data
@NoArgsConstructor
public class SmartGeneratedResumeResponse {

    private Long id;
    private SmartResumeOutput resumeContent;
    private HrValidationResponse validation; // nullable — null if HR Validator failed
    private LocalDateTime createdAt;

    // ── Nested DTO ───────────────────────────────────────────

    /**
     * HR validation scores and feedback for the generated resume.
     */
    @Data
    @NoArgsConstructor
    public static class HrValidationResponse {

        private double overallScore;
        private double keywordMatchScore;
        private double experienceRelevanceScore;
        private double skillsAlignmentScore;
        private double resumeQualityScore;
        private double educationFitScore;
        private List<String> gaps;
        private List<String> strengths;
        private List<RecommendationItem> recommendations;
    }
}
