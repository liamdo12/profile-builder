package com.profilebuilder.service;

import com.profilebuilder.exception.InvalidFileException;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.TextContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

/**
 * Extracts text from job description files (PDF or PNG).
 */
@Service
public class JdExtractionService {

    private static final Logger log = LoggerFactory.getLogger(JdExtractionService.class);

    private final ChatModel chatLanguageModel;

    public JdExtractionService(ChatModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
    }

    /**
     * Extract text content from a PDF or PNG file.
     */
    public String extractText(MultipartFile file) {
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();

        if (contentType != null && contentType.equals("application/pdf")) {
            return extractFromPdf(file);
        } else if (contentType != null && contentType.equals("image/png")) {
            return extractFromImage(file);
        } else if (fileName != null && fileName.toLowerCase().endsWith(".pdf")) {
            return extractFromPdf(file);
        } else if (fileName != null && fileName.toLowerCase().endsWith(".png")) {
            return extractFromImage(file);
        }

        throw new InvalidFileException(
                "Unsupported file type: " + contentType + ". Only PDF and PNG files are accepted.");
    }

    /**
     * Extract text from a file on disk (PDF only for resumes).
     */
    public String extractTextFromPath(Path filePath) {
        try {
            byte[] bytes = Files.readAllBytes(filePath);
            try (PDDocument document = Loader.loadPDF(bytes)) {
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(document);
                log.info("Extracted {} characters from PDF at {}", text.length(), filePath);
                return text;
            }
        } catch (IOException e) {
            throw new InvalidFileException("Failed to extract text from file: " + e.getMessage());
        }
    }

    private String extractFromPdf(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.info("Extracted {} characters from PDF", text.length());
            return text;
        } catch (IOException e) {
            throw new InvalidFileException("Failed to extract text from PDF: " + e.getMessage());
        }
    }

    private String extractFromImage(MultipartFile file) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

            UserMessage message = UserMessage.from(
                    TextContent.from("Extract all text from this image of a job description. "
                            + "Return only the extracted text, preserving the original structure as much as possible."),
                    ImageContent.from(base64Image, "image/png")
            );

            String text = chatLanguageModel.chat(message).aiMessage().text();
            log.info("Extracted {} characters from PNG via Vision API", text.length());
            return text;
        } catch (IOException e) {
            throw new InvalidFileException("Failed to read image file: " + e.getMessage());
        }
    }
}
