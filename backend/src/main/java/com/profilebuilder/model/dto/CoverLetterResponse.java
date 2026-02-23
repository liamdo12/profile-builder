package com.profilebuilder.model.dto;

import com.profilebuilder.ai.dto.CompanyResearchOutput;
import com.profilebuilder.ai.dto.CoverLetterOutput;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for cover letter generation endpoints.
 * Contains the generated cover letter content, company research, and optional evaluation.
 */
@Data
@NoArgsConstructor
public class CoverLetterResponse {

    private Long id;
    private CoverLetterOutput coverLetterContent;
    private CompanyResearchOutput companyResearch;
    private EvaluationResponse evaluation; // nullable — null if evaluator failed
    private LocalDateTime createdAt;

    // ── Nested DTO ───────────────────────────────────────────

    /**
     * Cover letter evaluation scores and feedback.
     */
    @Data
    @NoArgsConstructor
    public static class EvaluationResponse {

        private double matchPercentage;
        private String verdict;
        private List<String> suggestions;
    }
}
