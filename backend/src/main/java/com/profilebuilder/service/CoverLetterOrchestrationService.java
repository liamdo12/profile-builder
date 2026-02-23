package com.profilebuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.profilebuilder.ai.agent.CompanyResearchAgent;
import com.profilebuilder.ai.agent.CoverLetterGeneratorAgent;
import com.profilebuilder.ai.dto.CompanyResearchOutput;
import com.profilebuilder.ai.dto.CoverLetterOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Orchestrates the two-agent cover letter generation pipeline:
 * 1. CompanyResearchAgent — researches company from JD (FATAL if fails)
 * 2. CoverLetterGeneratorAgent — produces tailored cover letter using research
 */
@Service
public class CoverLetterOrchestrationService {

    private static final Logger log = LoggerFactory.getLogger(CoverLetterOrchestrationService.class);

    private final CompanyResearchAgent companyResearchAgent;
    private final CoverLetterGeneratorAgent coverLetterGeneratorAgent;
    private final ObjectMapper objectMapper;

    public CoverLetterOrchestrationService(CompanyResearchAgent companyResearchAgent,
                                           CoverLetterGeneratorAgent coverLetterGeneratorAgent,
                                           ObjectMapper objectMapper) {
        this.companyResearchAgent = companyResearchAgent;
        this.coverLetterGeneratorAgent = coverLetterGeneratorAgent;
        this.objectMapper = objectMapper;
    }

    /**
     * Holds the outputs of both agents. Both fields are non-null on success.
     */
    public record OrchestrationResult(
            CompanyResearchOutput companyResearch,
            CoverLetterOutput coverLetterOutput
    ) {}

    /**
     * Runs Agent 1 (company research) then Agent 2 (cover letter generation) sequentially.
     * Company research failure is FATAL and throws an exception immediately.
     */
    public OrchestrationResult orchestrate(String resumeText, String masterCoverLetterText, String jdText) {
        try {
            // Agent 1: Company Research — FATAL if fails
            String researchInput = objectMapper.writeValueAsString(Map.of("jdText", jdText));
            log.info("Running Company Research Agent...");
            CompanyResearchOutput companyResearch = companyResearchAgent.researchCompany(researchInput);

            if (companyResearch == null || companyResearch.getCompanyName() == null
                    || companyResearch.getCompanyName().isBlank()) {
                throw new RuntimeException("Company research failed: could not identify company from job description");
            }
            log.info("Company Research complete: {}", companyResearch.getCompanyName());

            // Agent 2: Cover Letter Generator
            String companyResearchJson = objectMapper.writeValueAsString(companyResearch);
            String generatorInput = objectMapper.writeValueAsString(Map.of(
                    "resumeText", resumeText,
                    "masterCoverLetterText", masterCoverLetterText,
                    "companyResearch", companyResearchJson,
                    "jdText", jdText
            ));
            log.info("Running Cover Letter Generator Agent...");
            CoverLetterOutput coverLetterOutput = coverLetterGeneratorAgent.generateCoverLetter(generatorInput);
            log.info("Cover Letter Generator complete: {} paragraphs", coverLetterOutput.getParagraphs().size());

            return new OrchestrationResult(companyResearch, coverLetterOutput);

        } catch (dev.langchain4j.exception.LangChain4jException e) {
            throw e; // Let GlobalExceptionHandler return 503
        } catch (Exception e) {
            throw new RuntimeException("Cover letter orchestration failed: " + e.getMessage(), e);
        }
    }
}
