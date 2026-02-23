package com.profilebuilder.ai.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AI output DTO for the resume generator agent.
 * Represents a complete, structured resume tailored to a job description.
 */
@Data
@NoArgsConstructor
public class SmartResumeOutput {

    private PersonalInfo personalInfo;
    private List<ResumeSection> sections;

    @Data
    @NoArgsConstructor
    public static class PersonalInfo {
        private String fullName;
        private String location;
        private String phone;
        private String email;
        private String linkedinUrl;
        private String githubUrl;
    }

    @Data
    @NoArgsConstructor
    public static class ResumeSection {
        private String sectionName; // EDUCATION, EXPERIENCE, PROJECTS, SKILLS
        private List<SectionEntry> entries;
    }

    @Data
    @NoArgsConstructor
    public static class SectionEntry {
        private String title;       // Job title / Institution / Project name / Skill category
        private String subtitle;    // Company / Degree / (empty for projects and skills)
        private String location;    // Location (education only)
        private String dateRange;   // Date range
        private List<String> bullets; // Bullet points
    }
}
