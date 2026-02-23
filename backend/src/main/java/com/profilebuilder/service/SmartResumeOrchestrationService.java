package com.profilebuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.profilebuilder.ai.agent.HrValidatorAgent;
import com.profilebuilder.ai.agent.ResumeGeneratorAgent;
import com.profilebuilder.ai.dto.HrValidationOutput;
import com.profilebuilder.ai.dto.SmartResumeOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.profilebuilder.model.dto.RecommendationItem;
import java.util.List;
import java.util.Map;

/**
 * Orchestrates the two-agent resume generation pipeline:
 * 1. ResumeGeneratorAgent — builds ATS-optimized resume from raw texts + JD
 * 2. HrValidatorAgent    — scores the generated resume (best-effort, non-blocking)
 */
@Service
public class SmartResumeOrchestrationService {

    private static final Logger log = LoggerFactory.getLogger(SmartResumeOrchestrationService.class);

    private final ResumeGeneratorAgent resumeGeneratorAgent;
    private final HrValidatorAgent hrValidatorAgent;
    private final ObjectMapper objectMapper;

    public SmartResumeOrchestrationService(ResumeGeneratorAgent resumeGeneratorAgent,
                                           HrValidatorAgent hrValidatorAgent,
                                           ObjectMapper objectMapper) {
        this.resumeGeneratorAgent = resumeGeneratorAgent;
        this.hrValidatorAgent = hrValidatorAgent;
        this.objectMapper = objectMapper;
    }

    /**
     * Holds the outputs of both agents. validationOutput may be null if Agent 2 failed.
     */
    public record OrchestrationResult(
            SmartResumeOutput resumeOutput,
            HrValidationOutput validationOutput
    ) {}

    /**
     * Runs Agent 1 (resume generation) then Agent 2 (HR validation) sequentially.
     * If Agent 2 fails, the result is still returned with a null validationOutput.
     */
    public OrchestrationResult orchestrate(List<String> resumeTexts, String jdText) {
        try {
            // Build input JSON for Agent 1
            String generatorInput = objectMapper.writeValueAsString(
                    Map.of("resumeTexts", resumeTexts, "jdText", jdText));

            // Run Agent 1 — Resume Generator
            log.info("Running Resume Generator Agent with {} resume(s)...", resumeTexts.size());
            SmartResumeOutput resumeOutput = resumeGeneratorAgent.generateResume(generatorInput);
            log.info("Resume Generator complete: {} sections produced", resumeOutput.getSections().size());

            // Run Agent 2 — HR Validator (best-effort, failure is non-fatal)
            HrValidationOutput validationOutput = null;
            try {
                String resumeJson = objectMapper.writeValueAsString(resumeOutput);
                String validatorInput = objectMapper.writeValueAsString(
                        Map.of("resumeContent", resumeJson, "jdText", jdText));
                log.info("Running HR Validator Agent...");
                validationOutput = hrValidatorAgent.validateResume(validatorInput);
                log.info("HR Validator complete: overall score={}", validationOutput.getOverallScore());
            } catch (Exception e) {
                log.warn("HR Validator failed, continuing without validation: {}", e.getMessage());
            }

            return new OrchestrationResult(resumeOutput, validationOutput);

        } catch (dev.langchain4j.exception.LangChain4jException e) {
            throw e; // Let GlobalExceptionHandler return 503
        } catch (Exception e) {
            throw new RuntimeException("Resume orchestration failed: " + e.getMessage(), e);
        }
    }

    /**
     * Orchestrates resume regeneration with selected recommendations applied.
     * Feeds current resume + JD + recommendations to the resume generator, then re-validates.
     */
    public OrchestrationResult orchestrateWithRecommendations(
            String currentResumeJson, String jdText, List<RecommendationItem> recommendations) {
        try {
            String augmentedInput = objectMapper.writeValueAsString(Map.of(
                "currentResume", currentResumeJson,
                "jdText", jdText,
                "recommendationsToApply", recommendations
            ));

            log.info("Running Resume Generator with {} recommendations...", recommendations.size());
            SmartResumeOutput resumeOutput = resumeGeneratorAgent.generateResume(augmentedInput);
            log.info("Resume Generator complete with applied recommendations");

            HrValidationOutput validationOutput = null;
            try {
                String resumeJson = objectMapper.writeValueAsString(resumeOutput);
                String validatorInput = objectMapper.writeValueAsString(
                        Map.of("resumeContent", resumeJson, "jdText", jdText));
                log.info("Running HR Validator on updated resume...");
                validationOutput = hrValidatorAgent.validateResume(validatorInput);
                log.info("HR Validator complete: overall score={}", validationOutput.getOverallScore());
            } catch (Exception e) {
                log.warn("HR Validator failed after apply: {}", e.getMessage());
            }

            return new OrchestrationResult(resumeOutput, validationOutput);
        } catch (dev.langchain4j.exception.LangChain4jException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Apply recommendations orchestration failed: " + e.getMessage(), e);
        }
    }
}
