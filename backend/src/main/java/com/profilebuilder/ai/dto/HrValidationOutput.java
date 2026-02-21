package com.profilebuilder.ai.dto;

import java.util.List;

/**
 * AI output DTO for the HR validator agent.
 * Contains scoring across 5 criteria plus gaps, strengths, and recommendations.
 */
public class HrValidationOutput {

    private double overallScore;                // 0.0 - 10.0 (weighted composite)
    private double keywordMatchScore;           // 0.0 - 1.0
    private double experienceRelevanceScore;    // 0.0 - 1.0
    private double skillsAlignmentScore;        // 0.0 - 1.0
    private double resumeQualityScore;          // 0.0 - 1.0
    private double educationFitScore;           // 0.0 - 1.0
    private List<String> gaps;
    private List<String> strengths;
    private List<String> recommendations;

    public HrValidationOutput() {
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
