package com.profilebuilder.util;

import com.profilebuilder.exception.InvalidFileException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

/**
 * Shared file validation utility for JD file uploads (PDF/PNG).
 * Used by SmartResumeController and CoverLetterController.
 */
public final class FileValidationUtil {

    private static final Set<String> ALLOWED_JD_CONTENT_TYPES = Set.of("application/pdf", "image/png");

    private FileValidationUtil() {
    }

    public static void validateJdFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();
        boolean validContentType = contentType != null && ALLOWED_JD_CONTENT_TYPES.contains(contentType);
        boolean validExtension = fileName != null
                && (fileName.toLowerCase().endsWith(".pdf") || fileName.toLowerCase().endsWith(".png"));
        if (!validContentType && !validExtension) {
            throw new InvalidFileException("Invalid file type. Only PDF and PNG files are accepted.");
        }
    }
}
