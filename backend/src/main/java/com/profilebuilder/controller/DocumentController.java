package com.profilebuilder.controller;

import com.profilebuilder.model.dto.DocumentUploadResponse;
import com.profilebuilder.model.enums.DocumentType;
import com.profilebuilder.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for document upload and retrieval.
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
            @RequestParam("documentType") DocumentType documentType) {

        DocumentUploadResponse response = documentService.uploadDocument(file, documentType);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * List all documents, optionally filtered by type.
     */
    @GetMapping
    public ResponseEntity<List<DocumentUploadResponse>> getDocuments(
            @RequestParam(value = "documentType", required = false) DocumentType documentType) {

        List<DocumentUploadResponse> documents = documentService.getDocuments(documentType);
        return ResponseEntity.ok(documents);
    }

    /**
     * Get a single document by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentUploadResponse> getDocumentById(@PathVariable Long id) {
        DocumentUploadResponse document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }
}
