package com.profilebuilder.ai.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AI output DTO for the cover letter evaluator agent.
 * Contains match percentage and improvement suggestions.
 */
@Data
@NoArgsConstructor
public class CoverLetterEvaluationOutput {

    private double matchPercentage;
    private String verdict;
    private List<String> suggestions;
}
