package com.profilebuilder.controller;

import com.profilebuilder.exception.InvalidFileException;
import com.profilebuilder.model.dto.SmartGeneratedResumeResponse;
import com.profilebuilder.service.JdExtractionService;
import com.profilebuilder.service.SmartResumeGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

/**
 * REST controller for smart resume generation endpoints.
 * Uses a two-agent AI pipeline: resume generator + HR validator.
 */
@RestController
@RequestMapping("/api/smart-resume")
public class SmartResumeController {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("application/pdf", "image/png");

    private final JdExtractionService jdExtractionService;
    private final SmartResumeGenerationService smartResumeGenerationService;

    public SmartResumeController(JdExtractionService jdExtractionService,
                                 SmartResumeGenerationService smartResumeGenerationService) {
        this.jdExtractionService = jdExtractionService;
        this.smartResumeGenerationService = smartResumeGenerationService;
    }

    /**
     * POST /api/smart-resume/generate
     * Accepts a JD file (PDF or PNG) and a list of document IDs to generate a smart resume.
     */
    @PostMapping("/generate")
    public ResponseEntity<SmartGeneratedResumeResponse> generate(
            @RequestParam("jdFile") MultipartFile jdFile,
            @RequestParam("documentIds") List<Long> documentIds) {
        validateFile(jdFile);
        String jdText = jdExtractionService.extractText(jdFile);
        SmartGeneratedResumeResponse response = smartResumeGenerationService.generate(jdText, documentIds);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/smart-resume/{id}
     * Retrieves a previously generated smart resume with its HR validation data.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SmartGeneratedResumeResponse> getSmartResume(@PathVariable Long id) {
        return ResponseEntity.ok(smartResumeGenerationService.getSmartResume(id));
    }

    /**
     * POST /api/smart-resume/{id}/regenerate
     * Re-runs the AI pipeline for an existing smart resume using the same JD and documents.
     */
    @PostMapping("/{id}/regenerate")
    public ResponseEntity<SmartGeneratedResumeResponse> regenerate(@PathVariable Long id) {
        return ResponseEntity.ok(smartResumeGenerationService.regenerate(id));
    }

    // ── Private helpers ──────────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();
        boolean validContentType = contentType != null && ALLOWED_CONTENT_TYPES.contains(contentType);
        boolean validExtension = fileName != null
                && (fileName.toLowerCase().endsWith(".pdf") || fileName.toLowerCase().endsWith(".png"));
        if (!validContentType && !validExtension) {
            throw new InvalidFileException("Invalid file type. Only PDF and PNG files are accepted.");
        }
    }
}
