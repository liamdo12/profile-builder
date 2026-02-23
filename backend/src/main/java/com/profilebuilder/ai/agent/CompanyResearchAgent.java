package com.profilebuilder.ai.agent;

import com.profilebuilder.ai.dto.CompanyResearchOutput;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * Company research agent. Uses Tavily web search to find
 * company info: YouTube videos, engineering blogs, products,
 * services, and tech stack.
 */
public interface CompanyResearchAgent {
    @SystemMessage(fromResource = "prompts/company-research-system.txt")
    CompanyResearchOutput researchCompany(@UserMessage String inputJson);
}
