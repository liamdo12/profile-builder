package com.profilebuilder.exception;

/**
 * Thrown when file storage operations fail (disk I/O errors).
 * Mapped to HTTP 500 by GlobalExceptionHandler — this is a true server error.
 */
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
