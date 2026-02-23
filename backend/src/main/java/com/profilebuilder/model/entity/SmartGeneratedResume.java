package com.profilebuilder.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pb_smart_generated_resumes")
@Getter
@Setter
@NoArgsConstructor
public class SmartGeneratedResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jd_text", nullable = false, columnDefinition = "TEXT")
    private String jdText;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "document_ids", nullable = false, columnDefinition = "jsonb")
    private List<Long> documentIds;

    @Column(name = "resume_content", nullable = false, columnDefinition = "TEXT")
    private String resumeContent;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "personal_info", columnDefinition = "jsonb")
    private String personalInfo;

    @Column(name = "user_id")
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
