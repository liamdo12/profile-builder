package com.profilebuilder.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.profilebuilder.model.dto.RecommendationItem;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pb_smart_hr_validations")
@Getter
@Setter
@NoArgsConstructor
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
    private List<RecommendationItem> recommendations;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
