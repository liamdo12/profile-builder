package com.profilebuilder.ai.agent;

import com.profilebuilder.ai.dto.CoverLetterEvaluationOutput;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * Cover letter evaluator agent. Scores match percentage against
 * JD and provides improvement suggestions.
 */
public interface CoverLetterEvaluatorAgent {
    @SystemMessage(fromResource = "prompts/cover-letter-evaluator-system.txt")
    CoverLetterEvaluationOutput evaluateCoverLetter(@UserMessage String inputJson);
}
