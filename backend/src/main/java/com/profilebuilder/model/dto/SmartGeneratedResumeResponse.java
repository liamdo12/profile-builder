package com.profilebuilder.model.dto;

import com.profilebuilder.ai.dto.SmartResumeOutput;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for smart resume generation endpoints.
 * Contains the generated resume content and optional HR validation scores.
 */
public class SmartGeneratedResumeResponse {

    private Long id;
    private SmartResumeOutput resumeContent;
    private HrValidationResponse validation; // nullable — null if HR Validator failed
    private LocalDateTime createdAt;

    public SmartGeneratedResumeResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SmartResumeOutput getResumeContent() {
        return resumeContent;
    }

    public void setResumeContent(SmartResumeOutput resumeContent) {
        this.resumeContent = resumeContent;
    }

    public HrValidationResponse getValidation() {
        return validation;
    }

    public void setValidation(HrValidationResponse validation) {
        this.validation = validation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // ── Nested DTO ───────────────────────────────────────────

    /**
     * HR validation scores and feedback for the generated resume.
     */
    public static class HrValidationResponse {

        private double overallScore;
        private double keywordMatchScore;
        private double experienceRelevanceScore;
        private double skillsAlignmentScore;
        private double resumeQualityScore;
        private double educationFitScore;
        private List<String> gaps;
        private List<String> strengths;
        private List<String> recommendations;

        public HrValidationResponse() {
        }

        public double getOverallScore() {
            return overallScore;
        }

        public void setOverallScore(double overallScore) {
            this.overallScore = overallScore;
        }

        public double getKeywordMatchScore() {
            return keywordMatchScore;
        }

        public void setKeywordMatchScore(double keywordMatchScore) {
            this.keywordMatchScore = keywordMatchScore;
        }

        public double getExperienceRelevanceScore() {
            return experienceRelevanceScore;
        }

        public void setExperienceRelevanceScore(double experienceRelevanceScore) {
            this.experienceRelevanceScore = experienceRelevanceScore;
        }

        public double getSkillsAlignmentScore() {
            return skillsAlignmentScore;
        }

        public void setSkillsAlignmentScore(double skillsAlignmentScore) {
            this.skillsAlignmentScore = skillsAlignmentScore;
        }

        public double getResumeQualityScore() {
            return resumeQualityScore;
        }

        public void setResumeQualityScore(double resumeQualityScore) {
            this.resumeQualityScore = resumeQualityScore;
        }

        public double getEducationFitScore() {
            return educationFitScore;
        }

        public void setEducationFitScore(double educationFitScore) {
            this.educationFitScore = educationFitScore;
        }

        public List<String> getGaps() {
            return gaps;
        }

        public void setGaps(List<String> gaps) {
            this.gaps = gaps;
        }

        public List<String> getStrengths() {
            return strengths;
        }

        public void setStrengths(List<String> strengths) {
            this.strengths = strengths;
        }

        public List<String> getRecommendations() {
            return recommendations;
        }

        public void setRecommendations(List<String> recommendations) {
            this.recommendations = recommendations;
        }
    }
}
