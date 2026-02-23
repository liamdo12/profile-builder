package com.profilebuilder.service;

import com.profilebuilder.exception.InvalidFileException;
import com.profilebuilder.exception.ResourceNotFoundException;
import com.profilebuilder.model.dto.DocumentUploadResponse;
import com.profilebuilder.model.entity.Document;
import com.profilebuilder.model.enums.DocumentType;
import com.profilebuilder.repository.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

/**
 * Service handling document upload, validation, and persistence.
 * Supports S3 storage (ECS/production) and local filesystem (dev).
 * All operations are scoped to the authenticated user (userId).
 */
@Service
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private final DocumentRepository documentRepository;
    private final S3Client s3Client;

    @Value("${app.upload.dir:src/main/resources/uploads}")
    private String uploadDir;

    @Value("${app.s3.bucket-name:}")
    private String s3BucketName;

    public DocumentService(DocumentRepository documentRepository,
                           @Autowired(required = false) @Nullable S3Client s3Client) {
        this.documentRepository = documentRepository;
        this.s3Client = s3Client;
    }

    /**
     * Upload and persist a document scoped to the given user.
     * Uses S3 when bucket name is configured, otherwise local filesystem.
     */
    public DocumentUploadResponse uploadDocument(MultipartFile file, DocumentType documentType, Long userId) {
        validateFile(file);

        String originalName = file.getOriginalFilename();
        String extension = getFileExtension(originalName);
        String storedFileName = UUID.randomUUID() + extension;

        String filePath;
        if (useS3()) {
            filePath = uploadToS3(file, storedFileName, userId);
        } else {
            filePath = uploadToLocal(file, storedFileName);
        }

        Document document = new Document();
        document.setFileName(storedFileName);
        document.setOriginalName(originalName);
        document.setFilePath(filePath);
        document.setFileType(file.getContentType());
        document.setDocumentType(documentType);
        document.setFileSize(file.getSize());
        document.setUserId(userId);

        Document saved = documentRepository.save(document);
        return toResponse(saved);
    }

    /**
     * Get documents for the given user, optionally filtered by type.
     */
    public List<DocumentUploadResponse> getDocuments(DocumentType documentType, Long userId) {
        List<Document> documents = (documentType != null)
                ? documentRepository.findByUserIdAndDocumentType(userId, documentType)
                : documentRepository.findByUserId(userId);

        return documents.stream().map(this::toResponse).toList();
    }

    /**
     * Get a single document by ID, scoped to the given user.
     */
    public DocumentUploadResponse getDocumentById(Long id, Long userId) {
        Document document = documentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        return toResponse(document);
    }

    // ── Storage helpers ──────────────────────────────────────

    private boolean useS3() {
        return s3Client != null && StringUtils.hasText(s3BucketName);
    }

    private String uploadToS3(MultipartFile file, String storedFileName, Long userId) {
        String s3Key = userId + "/documents/" + storedFileName;
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(s3BucketName)
                    .key(s3Key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            log.info("File uploaded to S3: s3://{}/{}", s3BucketName, s3Key);
            return "s3://" + s3BucketName + "/" + s3Key;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3: " + storedFileName, e);
        }
    }

    private String uploadToLocal(MultipartFile file, String storedFileName) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path targetPath = uploadPath.resolve(storedFileName);

        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File saved locally: {}", targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + storedFileName, e);
        }
        return targetPath.toString();
    }

    /**
     * Delete file from storage (S3 or local).
     */
    public void deleteFile(String filePath) {
        try {
            if (filePath.startsWith("s3://") && useS3()) {
                String key = filePath.replace("s3://" + s3BucketName + "/", "");
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(s3BucketName)
                        .key(key)
                        .build());
                log.info("File deleted from S3: {}", filePath);
            } else {
                Files.deleteIfExists(Path.of(filePath));
                log.info("File deleted locally: {}", filePath);
            }
        } catch (Exception e) {
            log.warn("Failed to delete file: {}", filePath, e);
        }
    }

    // ── Validation helpers ───────────────────────────────────

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
