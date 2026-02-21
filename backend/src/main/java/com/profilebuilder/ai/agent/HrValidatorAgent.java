package com.profilebuilder.ai.agent;

import com.profilebuilder.ai.dto.HrValidationOutput;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * HR validator agent. Scores a generated resume against a job description
 * across 5 criteria and provides gaps, strengths, and recommendations.
 * Wired to gpt-5-mini via manual bean registration in AiConfig.
 */
public interface HrValidatorAgent {

    @SystemMessage(fromResource = "prompts/hr-validator-system.txt")
    HrValidationOutput validateResume(@UserMessage String inputJson);
}
