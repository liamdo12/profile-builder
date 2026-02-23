package com.profilebuilder.ai.agent;

import com.profilebuilder.ai.dto.CoverLetterOutput;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * Cover letter generator agent. Produces a tailored cover letter
 * following the master cover letter structure using resume content
 * and company research.
 */
public interface CoverLetterGeneratorAgent {
    @SystemMessage(fromResource = "prompts/cover-letter-generator-system.txt")
    CoverLetterOutput generateCoverLetter(@UserMessage String inputJson);
}
