package com.profilebuilder.exception;

/**
 * Thrown when an uploaded file fails validation (wrong type, empty, etc.).
 */
public class InvalidFileException extends RuntimeException {

    public InvalidFileException(String message) {
        super(message);
    }

    public InvalidFileException(String message, Throwable cause) {
        super(message, cause);
    }
}
