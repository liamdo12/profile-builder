package com.profilebuilder.ai.agent;

import com.profilebuilder.ai.dto.SmartResumeOutput;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * Resume generator agent. Produces a complete ATS-optimized resume
 * from raw resume texts and a job description. Wired to main ChatModel in AiConfig.
 */
public interface ResumeGeneratorAgent {

    @SystemMessage(fromResource = "prompts/resume-generator-system.txt")
    SmartResumeOutput generateResume(@UserMessage String inputJson);
}
