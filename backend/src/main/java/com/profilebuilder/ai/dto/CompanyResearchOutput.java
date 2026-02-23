package com.profilebuilder.ai.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AI output DTO for the company research agent.
 * Contains structured company information from web search.
 */
@Data
@NoArgsConstructor
public class CompanyResearchOutput {

    private String companyName;
    private String companyDomain;
    private List<String> youtubeVideos;
    private List<String> engineeringBlogs;
    private List<String> products;
    private List<String> services;
    private List<String> techStack;
    private String summary;
}
