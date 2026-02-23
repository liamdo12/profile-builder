package com.profilebuilder.controller;

import com.profilebuilder.model.dto.DocumentUploadResponse;
import com.profilebuilder.model.entity.User;
import com.profilebuilder.model.enums.DocumentType;
import com.profilebuilder.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for document upload and retrieval.
 * All endpoints are scoped to the authenticated user.
 */
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /**
     * Upload a document (PDF or Word).
     */
    @PostMapping("/upload")
    public ResponseEntity<DocumentUploadResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") DocumentType documentType,
            @AuthenticationPrincipal User user) {

        DocumentUploadResponse response = documentService.uploadDocument(file, documentType, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * List all documents for the authenticated user, optionally filtered by type.
     */
    @GetMapping
    public ResponseEntity<List<DocumentUploadResponse>> getDocuments(
            @RequestParam(value = "documentType", required = false) DocumentType documentType,
            @AuthenticationPrincipal User user) {

        List<DocumentUploadResponse> documents = documentService.getDocuments(documentType, user.getId());
        return ResponseEntity.ok(documents);
    }

    /**
     * Get a single document by ID, scoped to the authenticated user.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentUploadResponse> getDocumentById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        DocumentUploadResponse document = documentService.getDocumentById(id, user.getId());
        return ResponseEntity.ok(document);
    }
}
