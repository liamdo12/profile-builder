package com.profilebuilder.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pb_smart_hr_validations")
public class SmartHrValidation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "smart_resume_id", nullable = false)
    private Long smartResumeId;

    @Column(name = "overall_score")
    private Double overallScore;

    @Column(name = "keyword_match_score")
    private Double keywordMatchScore;

    @Column(name = "experience_relevance_score")
    private Double experienceRelevanceScore;

    @Column(name = "skills_alignment_score")
    private Double skillsAlignmentScore;

    @Column(name = "resume_quality_score")
    private Double resumeQualityScore;

    @Column(name = "education_fit_score")
    private Double educationFitScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "gaps", columnDefinition = "jsonb")
    private List<String> gaps;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "strengths", columnDefinition = "jsonb")
    private List<String> strengths;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "recommendations", columnDefinition = "jsonb")
    private List<String> recommendations;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SmartHrValidation() {
    }

    // ── Getters & Setters ────────────────────────────────────

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSmartResumeId() {
        return smartResumeId;
    }

    public void setSmartResumeId(Long smartResumeId) {
        this.smartResumeId = smartResumeId;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public Double getKeywordMatchScore() {
        return keywordMatchScore;
    }

    public void setKeywordMatchScore(Double keywordMatchScore) {
        this.keywordMatchScore = keywordMatchScore;
    }

    public Double getExperienceRelevanceScore() {
        return experienceRelevanceScore;
    }

    public void setExperienceRelevanceScore(Double experienceRelevanceScore) {
        this.experienceRelevanceScore = experienceRelevanceScore;
    }

    public Double getSkillsAlignmentScore() {
        return skillsAlignmentScore;
    }

    public void setSkillsAlignmentScore(Double skillsAlignmentScore) {
        this.skillsAlignmentScore = skillsAlignmentScore;
    }

    public Double getResumeQualityScore() {
        return resumeQualityScore;
    }

    public void setResumeQualityScore(Double resumeQualityScore) {
        this.resumeQualityScore = resumeQualityScore;
    }

    public Double getEducationFitScore() {
        return educationFitScore;
    }

    public void setEducationFitScore(Double educationFitScore) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
