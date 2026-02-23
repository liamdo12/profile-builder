package com.profilebuilder.controller;

import com.profilebuilder.model.dto.CoverLetterResponse;
import com.profilebuilder.service.CoverLetterGenerationService;
import com.profilebuilder.service.JdExtractionService;
import com.profilebuilder.util.FileValidationUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller for cover letter generation endpoints.
 * Uses a two-agent AI pipeline: company researcher + cover letter generator.
 */
@RestController
@RequestMapping("/api/cover-letter")
public class CoverLetterController {

    private final JdExtractionService jdExtractionService;
    private final CoverLetterGenerationService coverLetterGenerationService;

    public CoverLetterController(JdExtractionService jdExtractionService,
                                  CoverLetterGenerationService coverLetterGenerationService) {
        this.jdExtractionService = jdExtractionService;
        this.coverLetterGenerationService = coverLetterGenerationService;
    }

    /**
     * POST /api/cover-letter/generate
     * Accepts a JD file (PDF or PNG), a resume doc ID, and a master cover letter doc ID.
     */
    @PostMapping("/generate")
    public ResponseEntity<CoverLetterResponse> generate(
            @RequestParam("jdFile") MultipartFile jdFile,
            @RequestParam("resumeDocId") Long resumeDocId,
            @RequestParam("coverLetterDocId") Long coverLetterDocId) {
        FileValidationUtil.validateJdFile(jdFile);
        String jdText = jdExtractionService.extractText(jdFile);
        CoverLetterResponse response = coverLetterGenerationService.generate(jdText, resumeDocId, coverLetterDocId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/cover-letter/{id}
     * Retrieves a previously generated cover letter with its evaluation data if available.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CoverLetterResponse> getCoverLetter(@PathVariable Long id) {
        return ResponseEntity.ok(coverLetterGenerationService.getCoverLetter(id));
    }

    /**
     * POST /api/cover-letter/{id}/evaluate
     * Runs the evaluator agent on an existing cover letter and persists the result.
     */
    @PostMapping("/{id}/evaluate")
    public ResponseEntity<CoverLetterResponse> evaluate(@PathVariable Long id) {
        return ResponseEntity.ok(coverLetterGenerationService.evaluate(id));
    }
}
