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
@Table(name = "pb_cover_letter_evaluations")
@Getter
@Setter
@NoArgsConstructor
public class CoverLetterEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cover_letter_id", nullable = false)
    private Long coverLetterId;

    @Column(name = "match_percentage")
    private Double matchPercentage;

    @Column(name = "verdict", columnDefinition = "TEXT")
    private String verdict;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "suggestions", columnDefinition = "jsonb")
    private List<String> suggestions;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
