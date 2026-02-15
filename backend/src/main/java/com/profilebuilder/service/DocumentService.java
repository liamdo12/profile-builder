package com.profilebuilder.service;

import com.profilebuilder.exception.InvalidFileException;
import com.profilebuilder.model.dto.DocumentUploadResponse;
import com.profilebuilder.model.entity.Document;
import com.profilebuilder.model.enums.DocumentType;
import com.profilebuilder.repository.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service handling document upload, validation, and persistence.
 */
@Service
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private final DocumentRepository documentRepository;

    @Value("${app.upload.dir:src/main/resources/uploads}")
    private String uploadDir;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    /**
     * Upload and persist a document.
     */
    public DocumentUploadResponse uploadDocument(MultipartFile file, DocumentType documentType) {
        validateFile(file);

        String originalName = file.getOriginalFilename();
        String extension = getFileExtension(originalName);
        String storedFileName = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path targetPath = uploadPath.resolve(storedFileName);

        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File saved: {}", targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + originalName, e);
        }

        Document document = new Document();
        document.setFileName(storedFileName);
        document.setOriginalName(originalName);
        document.setFilePath(targetPath.toString());
        document.setFileType(file.getContentType());
        document.setDocumentType(documentType);
        document.setFileSize(file.getSize());

        Document saved = documentRepository.save(document);
        return toResponse(saved);
    }

    /**
     * Get all documents, optionally filtered by type.
     */
    public List<DocumentUploadResponse> getDocuments(DocumentType documentType) {
        List<Document> documents = (documentType != null)
                ? documentRepository.findByDocumentType(documentType)
                : documentRepository.findAll();

        return documents.stream().map(this::toResponse).toList();
    }

    /**
     * Get a single document by ID.
     */
    public DocumentUploadResponse getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        return toResponse(document);
    }

    // ── Private helpers ──────────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new InvalidFileException(
                    "Invalid file type: " + contentType + ". Allowed types: PDF, DOC, DOCX");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private DocumentUploadResponse toResponse(Document doc) {
        return new DocumentUploadResponse(
                doc.getId(),
                doc.getFileName(),
                doc.getOriginalName(),
                doc.getFilePath(),
                doc.getFileType(),
                doc.getDocumentType(),
                doc.getFileSize(),
                doc.getCreatedAt());
    }
}
