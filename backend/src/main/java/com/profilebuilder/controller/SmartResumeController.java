package com.profilebuilder.controller;

import com.profilebuilder.ai.dto.SmartResumeOutput;
import com.profilebuilder.model.dto.ApplyRecommendationsRequest;
import com.profilebuilder.model.dto.SmartGeneratedResumeResponse;
import com.profilebuilder.model.entity.User;
import com.profilebuilder.service.SmartResumeDocxService;
import com.profilebuilder.util.FileValidationUtil;
import jakarta.validation.Valid;
import com.profilebuilder.service.JdExtractionService;
import com.profilebuilder.service.SmartResumeGenerationService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for smart resume generation endpoints.
 * Uses a two-agent AI pipeline: resume generator + HR validator.
 * All endpoints are scoped to the authenticated user.
 */
@RestController
@RequestMapping("/api/smart-resume")
public class SmartResumeController {

    private final JdExtractionService jdExtractionService;
    private final SmartResumeGenerationService smartResumeGenerationService;
    private final SmartResumeDocxService smartResumeDocxService;

    public SmartResumeController(JdExtractionService jdExtractionService,
                                 SmartResumeGenerationService smartResumeGenerationService,
                                 SmartResumeDocxService smartResumeDocxService) {
        this.jdExtractionService = jdExtractionService;
        this.smartResumeGenerationService = smartResumeGenerationService;
        this.smartResumeDocxService = smartResumeDocxService;
    }

    /**
     * POST /api/smart-resume/generate
     * Accepts a JD file (PDF or PNG) and a list of document IDs to generate a smart resume.
     */
    @PostMapping("/generate")
    public ResponseEntity<SmartGeneratedResumeResponse> generate(
            @RequestParam("jdFile") MultipartFile jdFile,
            @RequestParam("documentIds") List<Long> documentIds,
            @AuthenticationPrincipal User user) {

        FileValidationUtil.validateJdFile(jdFile);
        String jdText = jdExtractionService.extractText(jdFile);
        SmartGeneratedResumeResponse response = smartResumeGenerationService.generate(jdText, documentIds, user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/smart-resume/{id}
     * Retrieves a previously generated smart resume with its HR validation data.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SmartGeneratedResumeResponse> getSmartResume(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(smartResumeGenerationService.getSmartResume(id, user.getId()));
    }

    /**
     * POST /api/smart-resume/{id}/regenerate
     * Re-runs the AI pipeline for an existing smart resume using the same JD and documents.
     */
    @PostMapping("/{id}/regenerate")
    public ResponseEntity<SmartGeneratedResumeResponse> regenerate(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(smartResumeGenerationService.regenerate(id, user.getId()));
    }

    /**
     * POST /api/smart-resume/{id}/apply-recommendations
     * Applies selected HR recommendations and re-generates the resume.
     */
    @PostMapping("/{id}/apply-recommendations")
    public ResponseEntity<SmartGeneratedResumeResponse> applyRecommendations(
            @PathVariable Long id,
            @RequestBody @Valid ApplyRecommendationsRequest request,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                smartResumeGenerationService.applyRecommendations(id, request.getRecommendations(), user.getId()));
    }

    /**
     * GET /api/smart-resume/{id}/download-docx
     * Downloads a DOCX file for the generated smart resume.
     */
    @GetMapping("/{id}/download-docx")
    public ResponseEntity<byte[]> downloadDocx(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        SmartResumeOutput resumeOutput = smartResumeGenerationService.getResumeOutput(id, user.getId());
        byte[] docxBytes = smartResumeDocxService.generateDocx(resumeOutput);
        String fullName = resumeOutput.getPersonalInfo() != null
                ? resumeOutput.getPersonalInfo().getFullName() : "resume";
        String sanitized = fullName.replaceAll("[^a-zA-Z0-9\\s-]", "").trim();
        String filename = (sanitized.isEmpty() ? "resume" : sanitized) + ".docx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
        return ResponseEntity.ok().headers(headers).body(docxBytes);
    }
}
