package com.profilebuilder.model.entity;

import com.profilebuilder.model.enums.SourceSite;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * A job listing scraped by the crawler. Deduplicated per source via source_url_hash.
 */
@Entity
@Table(name = "pb_crawled_jobs", indexes = {
        @Index(name = "idx_crawled_jobs_user_source_hash", columnList = "user_id, source_url_hash"),
        @Index(name = "idx_crawled_jobs_date_posted", columnList = "date_posted"),
        @Index(name = "idx_crawled_jobs_user_id", columnList = "user_id"),
        @Index(name = "idx_crawled_jobs_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CrawledJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "job_search_id", nullable = false)
    private Long jobSearchId;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "company")
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "salary_info")
    private String salaryInfo;

    @Column(name = "date_posted")
    private LocalDateTime datePosted;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "source_url", nullable = false, length = 1024)
    private String sourceUrl;

    @Column(name = "source_url_hash", nullable = false, length = 64)
    private String sourceUrlHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_site", nullable = false, length = 50)
    private SourceSite sourceSite;

    @Column(name = "is_notified", nullable = false)
    private Boolean isNotified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
