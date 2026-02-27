package com.profilebuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.profilebuilder.ai.agent.CoverLetterEvaluatorAgent;
import com.profilebuilder.ai.dto.CompanyResearchOutput;
import com.profilebuilder.ai.dto.CoverLetterEvaluationOutput;
import com.profilebuilder.ai.dto.CoverLetterOutput;
import com.profilebuilder.exception.ResourceNotFoundException;
import com.profilebuilder.model.dto.CoverLetterResponse;
import com.profilebuilder.model.entity.CoverLetterEvaluation;
import com.profilebuilder.model.entity.Document;
import com.profilebuilder.model.entity.GeneratedCoverLetter;
import com.profilebuilder.repository.CoverLetterEvaluationRepository;
import com.profilebuilder.repository.DocumentRepository;
import com.profilebuilder.repository.GeneratedCoverLetterRepository;
import com.profilebuilder.service.CoverLetterOrchestrationService.OrchestrationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Main service for cover letter generation, evaluation, and retrieval.
 * Delegates AI work to CoverLetterOrchestrationService and persists results.
 * All operations are scoped to the authenticated user (userId).
 */
@Service
public class CoverLetterGenerationService {

    private static final Logger log = LoggerFactory.getLogger(CoverLetterGenerationService.class);

    private final GeneratedCoverLetterRepository coverLetterRepository;
    private final CoverLetterEvaluationRepository evaluationRepository;
    private final DocumentRepository documentRepository;
    private final JdExtractionService jdExtractionService;
    private final CoverLetterOrchestrationService orchestrationService;
    private final CoverLetterEvaluatorAgent coverLetterEvaluatorAgent;
    private final ObjectMapper objectMapper;

    public CoverLetterGenerationService(GeneratedCoverLetterRepository coverLetterRepository,
                                        CoverLetterEvaluationRepository evaluationRepository,
                                        DocumentRepository documentRepository,
                                        JdExtractionService jdExtractionService,
                                        CoverLetterOrchestrationService orchestrationService,
                                        CoverLetterEvaluatorAgent coverLetterEvaluatorAgent,
                                        ObjectMapper objectMapper) {
        this.coverLetterRepository = coverLetterRepository;
        this.evaluationRepository = evaluationRepository;
        this.documentRepository = documentRepository;
        this.jdExtractionService = jdExtractionService;
        this.orchestrationService = orchestrationService;
        this.coverLetterEvaluatorAgent = coverLetterEvaluatorAgent;
        this.objectMapper = objectMapper;
    }

    /**
     * Generates a new cover letter from a job description text, resume doc, and master cover letter doc.
     * Documents are verified to belong to the given user.
     */
    public CoverLetterResponse generate(String jdText, Long resumeDocId, Long coverLetterDocId, Long userId) {
        log.info("Generating cover letter for resumeDoc={}, coverLetterDoc={}", resumeDocId, coverLetterDocId);

        String resumeText = extractDocumentText(resumeDocId, userId);
        String masterCoverLetterText = extractDocumentText(coverLetterDocId, userId);

        // Run 2-agent orchestration pipeline
        OrchestrationResult result = orchestrationService.orchestrate(resumeText, masterCoverLetterText, jdText);

        // Persist entity
        GeneratedCoverLetter entity = new GeneratedCoverLetter();
        entity.setJdText(jdText);
        entity.setResumeDocumentId(resumeDocId);
        entity.setCoverLetterDocumentId(coverLetterDocId);
        entity.setUserId(userId);
        persistContent(entity, result);
        GeneratedCoverLetter saved = coverLetterRepository.save(entity);

        log.info("Cover letter saved with id={}", saved.getId());
        return toResponse(saved, result.coverLetterOutput(), result.companyResearch(), null);
    }

    /**
     * Evaluates an existing cover letter against its JD using the evaluator agent.
     * Verifies ownership before proceeding. Replaces any prior evaluation.
     */
    public CoverLetterResponse evaluate(Long id, Long userId) {
        GeneratedCoverLetter entity = coverLetterRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cover letter not found with id: " + id));

        log.info("Evaluating cover letter id={}", id);
        CoverLetterOutput coverLetterOutput = parseCoverLetterContent(entity.getCoverLetterContent());
        CompanyResearchOutput companyResearch = parseCompanyResearch(entity.getCompanyResearch());

        try {
            String evalInput = objectMapper.writeValueAsString(Map.of(
                    "coverLetterContent", objectMapper.writeValueAsString(coverLetterOutput),
                    "jdText", entity.getJdText()
            ));
            CoverLetterEvaluationOutput evalOutput = coverLetterEvaluatorAgent.evaluateCoverLetter(evalInput);

            // Delete existing evaluation if any, then save new
            evaluationRepository.findByCoverLetterId(id).ifPresent(evaluationRepository::delete);
            CoverLetterEvaluation evalEntity = mapToEvaluationEntity(evalOutput, id);
            evaluationRepository.save(evalEntity);

            log.info("Evaluation complete: match={}%", evalOutput.getMatchPercentage());
            CoverLetterResponse.EvaluationResponse evalResponse = mapToEvaluationResponse(evalOutput);
            return toResponse(entity, coverLetterOutput, companyResearch, evalResponse);
        } catch (Exception e) {
            throw new RuntimeException("Cover letter evaluation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieves a previously generated cover letter with its evaluation data if available.
     * Verifies ownership before returning.
     */
    public CoverLetterResponse getCoverLetter(Long id, Long userId) {
        GeneratedCoverLetter entity = coverLetterRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cover letter not found with id: " + id));

        CoverLetterOutput coverLetterOutput = parseCoverLetterContent(entity.getCoverLetterContent());
        CompanyResearchOutput companyResearch = parseCompanyResearch(entity.getCompanyResearch());
        CoverLetterEvaluation evalEntity = evaluationRepository.findByCoverLetterId(id).orElse(null);

        CoverLetterResponse.EvaluationResponse evalResponse = null;
        if (evalEntity != null) {
            evalResponse = new CoverLetterResponse.EvaluationResponse();
            evalResponse.setMatchPercentage(evalEntity.getMatchPercentage() != null ? evalEntity.getMatchPercentage() : 0.0);
            evalResponse.setVerdict(evalEntity.getVerdict());
            evalResponse.setSuggestions(evalEntity.getSuggestions());
        }

        return toResponse(entity, coverLetterOutput, companyResearch, evalResponse);
    }

    // ── Private helpers ──────────────────────────────────────

    /** Looks up document by ID, verifies ownership, then extracts text content from disk. */
    private String extractDocumentText(Long docId, Long userId) {
        Document doc = documentRepository.findByIdAndUserId(docId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + docId));
        return jdExtractionService.extractTextFromPath(doc.getFilePath());
    }

    /** Serializes orchestration result into entity fields. */
    private void persistContent(GeneratedCoverLetter entity, OrchestrationResult result) {
        try {
            entity.setCoverLetterContent(objectMapper.writeValueAsString(result.coverLetterOutput()));
            entity.setCompanyResearch(objectMapper.writeValueAsString(result.companyResearch()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize cover letter content: " + e.getMessage(), e);
        }
    }

    /** Deserializes stored JSON back into CoverLetterOutput. */
    private CoverLetterOutput parseCoverLetterContent(String json) {
        try {
            return objectMapper.readValue(json, CoverLetterOutput.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse cover letter content: " + e.getMessage(), e);
        }
    }

    /** Deserializes stored JSON back into CompanyResearchOutput. Returns null if JSON is blank. */
    private CompanyResearchOutput parseCompanyResearch(String json) {
        try {
            if (json == null || json.isBlank()) return null;
            return objectMapper.readValue(json, CompanyResearchOutput.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse company research: " + e.getMessage(), e);
        }
    }

    /** Builds the response DTO from a saved entity and content/research/evaluation data. */
    private CoverLetterResponse toResponse(GeneratedCoverLetter entity, CoverLetterOutput content,
                                            CompanyResearchOutput research, CoverLetterResponse.EvaluationResponse eval) {
        CoverLetterResponse response = new CoverLetterResponse();
        response.setId(entity.getId());
        response.setCoverLetterContent(content);
        response.setCompanyResearch(research);
        response.setEvaluation(eval);
        response.setCreatedAt(entity.getCreatedAt());
        return response;
    }

    /** Maps CoverLetterEvaluationOutput DTO to CoverLetterEvaluation entity. */
    private CoverLetterEvaluation mapToEvaluationEntity(CoverLetterEvaluationOutput output, Long coverLetterId) {
        CoverLetterEvaluation entity = new CoverLetterEvaluation();
        entity.setCoverLetterId(coverLetterId);
        entity.setMatchPercentage(output.getMatchPercentage());
        entity.setVerdict(output.getVerdict());
        entity.setSuggestions(output.getSuggestions());
        return entity;
    }

    /** Maps CoverLetterEvaluationOutput DTO to EvaluationResponse DTO. */
    private CoverLetterResponse.EvaluationResponse mapToEvaluationResponse(CoverLetterEvaluationOutput output) {
        CoverLetterResponse.EvaluationResponse response = new CoverLetterResponse.EvaluationResponse();
        response.setMatchPercentage(output.getMatchPercentage());
        response.setVerdict(output.getVerdict());
        response.setSuggestions(output.getSuggestions());
        return response;
    }
}
