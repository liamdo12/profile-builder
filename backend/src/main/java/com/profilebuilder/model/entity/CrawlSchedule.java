package com.profilebuilder.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Per-user crawl scheduling configuration.
 * Controls how often the system runs the job crawler for each user.
 */
@Entity
@Table(name = "pb_crawl_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CrawlSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "interval_hours", nullable = false)
    private Integer intervalHours = 3;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled = true;

    @Column(name = "last_crawl_at")
    private LocalDateTime lastCrawlAt;

    @Column(name = "next_crawl_at")
    private LocalDateTime nextCrawlAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
