package com.profilebuilder.ai.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AI output DTO for the cover letter generator agent.
 * Preserves master cover letter structure with tailored content.
 */
@Data
@NoArgsConstructor
public class CoverLetterOutput {

    private String greeting;
    private List<String> paragraphs;
    private String closing;
    private String signOff;
}
