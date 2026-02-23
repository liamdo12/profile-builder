package com.profilebuilder.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "pb_generated_cover_letters")
@Getter
@Setter
@NoArgsConstructor
public class GeneratedCoverLetter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jd_text", nullable = false, columnDefinition = "TEXT")
    private String jdText;

    @Column(name = "resume_document_id", nullable = false)
    private Long resumeDocumentId;

    @Column(name = "cover_letter_document_id", nullable = false)
    private Long coverLetterDocumentId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "company_research", columnDefinition = "jsonb")
    private String companyResearch;

    @Column(name = "cover_letter_content", nullable = false, columnDefinition = "TEXT")
    private String coverLetterContent;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
