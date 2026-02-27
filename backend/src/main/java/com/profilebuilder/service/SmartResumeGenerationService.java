package com.profilebuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.profilebuilder.ai.dto.HrValidationOutput;
import com.profilebuilder.ai.dto.SmartResumeOutput;
import com.profilebuilder.exception.ResourceNotFoundException;
import com.profilebuilder.model.dto.SmartGeneratedResumeResponse;
import com.profilebuilder.model.entity.Document;
import com.profilebuilder.model.entity.SmartGeneratedResume;
import com.profilebuilder.model.entity.SmartHrValidation;
import com.profilebuilder.repository.DocumentRepository;
import com.profilebuilder.repository.SmartGeneratedResumeRepository;
import com.profilebuilder.repository.SmartHrValidationRepository;
import com.profilebuilder.service.SmartResumeOrchestrationService.OrchestrationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.profilebuilder.model.dto.RecommendationItem;
import java.util.ArrayList;
import java.util.List;

/**
 * Main service for smart resume generation, regeneration, and retrieval.
 * Delegates AI work to SmartResumeOrchestrationService and persists results.
 * All operations are scoped to the authenticated user (userId).
 */
@Service
public class SmartResumeGenerationService {

    private static final Logger log = LoggerFactory.getLogger(SmartResumeGenerationService.class);

    private final SmartGeneratedResumeRepository smartResumeRepository;
    private final SmartHrValidationRepository hrValidationRepository;
    private final DocumentRepository documentRepository;
    private final JdExtractionService jdExtractionService;
    private final SmartResumeOrchestrationService orchestrationService;
    private final ObjectMapper objectMapper;

    public SmartResumeGenerationService(SmartGeneratedResumeRepository smartResumeRepository,
                                        SmartHrValidationRepository hrValidationRepository,
                                        DocumentRepository documentRepository,
                                        JdExtractionService jdExtractionService,
                                        SmartResumeOrchestrationService orchestrationService,
                                        ObjectMapper objectMapper) {
        this.smartResumeRepository = smartResumeRepository;
        this.hrValidationRepository = hrValidationRepository;
        this.documentRepository = documentRepository;
        this.jdExtractionService = jdExtractionService;
        this.orchestrationService = orchestrationService;
        this.objectMapper = objectMapper;
    }

    /**
     * Generates a new smart resume from a job description text and selected document IDs.
     * Documents are verified to belong to the given user.
     */
    public SmartGeneratedResumeResponse generate(String jdText, List<Long> documentIds, Long userId) {
        log.info("Generating smart resume for {} document(s)", documentIds.size());
        List<String> resumeTexts = extractResumeTexts(documentIds, userId);

        OrchestrationResult result = orchestrationService.orchestrate(resumeTexts, jdText);

        SmartGeneratedResume entity = new SmartGeneratedResume();
        entity.setJdText(jdText);
        entity.setDocumentIds(documentIds);
        entity.setUserId(userId);
        persistResumeContent(entity, result.resumeOutput());
        SmartGeneratedResume saved = smartResumeRepository.save(entity);

        if (result.validationOutput() != null) {
            SmartHrValidation validation = mapToValidationEntity(result.validationOutput(), saved.getId());
            hrValidationRepository.save(validation);
        }

        log.info("Smart resume saved with id={}", saved.getId());
        return toResponse(saved, result);
    }

    /**
     * Regenerates an existing smart resume using the same JD and document IDs.
     * Verifies ownership before proceeding.
     */
    @Transactional
    public SmartGeneratedResumeResponse regenerate(Long id, Long userId) {
        SmartGeneratedResume entity = smartResumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Smart resume not found with id: " + id));

        log.info("Regenerating smart resume id={}", id);
        List<String> resumeTexts = extractResumeTexts(entity.getDocumentIds(), userId);
        OrchestrationResult result = orchestrationService.orchestrate(resumeTexts, entity.getJdText());

        persistResumeContent(entity, result.resumeOutput());
        smartResumeRepository.save(entity);

        // Replace old validation with new one
        hrValidationRepository.findBySmartResumeId(id).ifPresent(hrValidationRepository::delete);
        if (result.validationOutput() != null) {
            hrValidationRepository.save(mapToValidationEntity(result.validationOutput(), id));
        }

        log.info("Smart resume id={} regenerated successfully", id);
        return toResponse(entity, result);
    }

    /**
     * Applies selected recommendations to an existing smart resume.
     * Re-generates the resume with recommendations as constraints, then re-validates.
     * Verifies ownership before proceeding.
     */
    @Transactional
    public SmartGeneratedResumeResponse applyRecommendations(Long id, List<RecommendationItem> recommendations, Long userId) {
        SmartGeneratedResume entity = smartResumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Smart resume not found with id: " + id));

        log.info("Applying {} recommendations to smart resume id={}", recommendations.size(), id);

        OrchestrationResult result = orchestrationService.orchestrateWithRecommendations(
                entity.getResumeContent(), entity.getJdText(), recommendations);

        persistResumeContent(entity, result.resumeOutput());
        smartResumeRepository.save(entity);

        // Replace old validation with new one
        hrValidationRepository.findBySmartResumeId(id).ifPresent(hrValidationRepository::delete);
        if (result.validationOutput() != null) {
            hrValidationRepository.save(mapToValidationEntity(result.validationOutput(), id));
        }

        log.info("Smart resume id={} updated with applied recommendations", id);
        return toResponse(entity, result);
    }

    /**
     * Retrieves a previously generated smart resume with its validation data.
     * Verifies ownership before returning.
     */
    public SmartGeneratedResumeResponse getSmartResume(Long id, Long userId) {
        SmartGeneratedResume entity = smartResumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Smart resume not found with id: " + id));

        SmartResumeOutput resumeOutput = parseResumeContent(entity.getResumeContent());
        SmartHrValidation validationEntity = hrValidationRepository.findBySmartResumeId(id).orElse(null);

        SmartGeneratedResumeResponse response = new SmartGeneratedResumeResponse();
        response.setId(entity.getId());
        response.setResumeContent(resumeOutput);
        response.setCreatedAt(entity.getCreatedAt());
        if (validationEntity != null) {
            response.setValidation(mapToValidationResponse(validationEntity));
        }
        return response;
    }

    /**
     * Retrieves and parses resume output by ID, scoped to user (used by DOCX service).
     */
    public SmartResumeOutput getResumeOutput(Long id, Long userId) {
        SmartGeneratedResume entity = smartResumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Smart resume not found: " + id));
        return parseResumeContent(entity.getResumeContent());
    }

    // ── Private helpers ──────────────────────────────────────

    /** Extracts text from each document PDF on disk, verifying each doc belongs to the user. */
    private List<String> extractResumeTexts(List<Long> documentIds, Long userId) {
        List<String> texts = new ArrayList<>();
        for (Long docId : documentIds) {
            Document doc = documentRepository.findByIdAndUserId(docId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + docId));
            String text = jdExtractionService.extractTextFromPath(doc.getFilePath());
            texts.add(text);
        }
        return texts;
    }

    /** Serializes resume output into entity fields. */
    private void persistResumeContent(SmartGeneratedResume entity, SmartResumeOutput resumeOutput) {
        try {
            entity.setResumeContent(objectMapper.writeValueAsString(resumeOutput));
            entity.setPersonalInfo(objectMapper.writeValueAsString(resumeOutput.getPersonalInfo()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize resume content: " + e.getMessage(), e);
        }
    }

    /** Deserializes stored JSON back into SmartResumeOutput. */
    private SmartResumeOutput parseResumeContent(String resumeContentJson) {
        try {
            return objectMapper.readValue(resumeContentJson, SmartResumeOutput.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse stored resume content: " + e.getMessage(), e);
        }
    }

    /** Builds the response DTO from a saved entity and fresh orchestration result. */
    private SmartGeneratedResumeResponse toResponse(SmartGeneratedResume entity, OrchestrationResult result) {
        SmartGeneratedResumeResponse response = new SmartGeneratedResumeResponse();
        response.setId(entity.getId());
        response.setResumeContent(result.resumeOutput());
        response.setCreatedAt(entity.getCreatedAt());
        if (result.validationOutput() != null) {
            response.setValidation(mapToValidationResponseFromOutput(result.validationOutput()));
        }
        return response;
    }

    /** Maps HrValidationOutput DTO to SmartHrValidation entity. */
    private SmartHrValidation mapToValidationEntity(HrValidationOutput output, Long smartResumeId) {
        SmartHrValidation entity = new SmartHrValidation();
        entity.setSmartResumeId(smartResumeId);
        entity.setOverallScore(output.getOverallScore());
        entity.setKeywordMatchScore(output.getKeywordMatchScore());
        entity.setExperienceRelevanceScore(output.getExperienceRelevanceScore());
        entity.setSkillsAlignmentScore(output.getSkillsAlignmentScore());
        entity.setResumeQualityScore(output.getResumeQualityScore());
        entity.setEducationFitScore(output.getEducationFitScore());
        entity.setGaps(output.getGaps());
        entity.setStrengths(output.getStrengths());
        entity.setRecommendations(output.getRecommendations());
        return entity;
    }

    /** Maps SmartHrValidation entity to response DTO (used on retrieval). */
    private SmartGeneratedResumeResponse.HrValidationResponse mapToValidationResponse(SmartHrValidation entity) {
        SmartGeneratedResumeResponse.HrValidationResponse response =
                new SmartGeneratedResumeResponse.HrValidationResponse();
        response.setOverallScore(entity.getOverallScore() != null ? entity.getOverallScore() : 0.0);
        response.setKeywordMatchScore(entity.getKeywordMatchScore() != null ? entity.getKeywordMatchScore() : 0.0);
        response.setExperienceRelevanceScore(entity.getExperienceRelevanceScore() != null ? entity.getExperienceRelevanceScore() : 0.0);
        response.setSkillsAlignmentScore(entity.getSkillsAlignmentScore() != null ? entity.getSkillsAlignmentScore() : 0.0);
        response.setResumeQualityScore(entity.getResumeQualityScore() != null ? entity.getResumeQualityScore() : 0.0);
        response.setEducationFitScore(entity.getEducationFitScore() != null ? entity.getEducationFitScore() : 0.0);
        response.setGaps(entity.getGaps());
        response.setStrengths(entity.getStrengths());
        response.setRecommendations(entity.getRecommendations());
        return response;
    }

    /** Maps HrValidationOutput DTO directly to response DTO (used after fresh generation). */
    private SmartGeneratedResumeResponse.HrValidationResponse mapToValidationResponseFromOutput(HrValidationOutput output) {
        SmartGeneratedResumeResponse.HrValidationResponse response =
                new SmartGeneratedResumeResponse.HrValidationResponse();
        response.setOverallScore(output.getOverallScore());
        response.setKeywordMatchScore(output.getKeywordMatchScore());
        response.setExperienceRelevanceScore(output.getExperienceRelevanceScore());
        response.setSkillsAlignmentScore(output.getSkillsAlignmentScore());
        response.setResumeQualityScore(output.getResumeQualityScore());
        response.setEducationFitScore(output.getEducationFitScore());
        response.setGaps(output.getGaps());
        response.setStrengths(output.getStrengths());
        response.setRecommendations(output.getRecommendations());
        return response;
    }
}
