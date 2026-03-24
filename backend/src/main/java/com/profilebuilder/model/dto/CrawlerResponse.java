package com.profilebuilder.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Response DTO from the Node.js crawler service POST /crawl endpoint.
 */
@Data
@NoArgsConstructor
public class CrawlerResponse {
    private boolean success;
    private List<CrawledJobDto> jobs;
    private List<CrawlerError> errors;
    private Map<String, Object> metadata;

    @Data
    @NoArgsConstructor
    public static class CrawledJobDto {
        private String title;
        private String company;
        private String location;
        private String salaryInfo;
        private String datePosted;
        private String description;
        private String sourceUrl;
        private String sourceSite;
    }

    @Data
    @NoArgsConstructor
    public static class CrawlerError {
        private String source;
        private String message;
        private boolean retryable;
    }
}
