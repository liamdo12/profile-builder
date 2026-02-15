package com.profilebuilder.model.dto;

import com.profilebuilder.model.enums.DocumentType;

import java.time.LocalDateTime;

/**
 * DTO returned after a successful document upload.
 */
public class DocumentUploadResponse {

    private Long id;
    private String fileName;
    private String originalName;
    private String filePath;
    private String fileType;
    private DocumentType documentType;
    private Long fileSize;
    private LocalDateTime createdAt;

    public DocumentUploadResponse() {
    }

    public DocumentUploadResponse(Long id, String fileName, String originalName, String filePath,
            String fileType, DocumentType documentType, Long fileSize,
            LocalDateTime createdAt) {
        this.id = id;
        this.fileName = fileName;
        this.originalName = originalName;
        this.filePath = filePath;
        this.fileType = fileType;
        this.documentType = documentType;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
    }

    // ── Getters & Setters ────────────────────────────────────

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
