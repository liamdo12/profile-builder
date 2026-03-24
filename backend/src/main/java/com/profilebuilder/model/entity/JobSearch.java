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
 * User-configured job search criteria used by the crawler.
 * Each user can have multiple active searches.
 */
@Entity
@Table(name = "pb_job_searches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobSearch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "location")
    private String location;

    @Column(name = "remote_only", nullable = false)
    private Boolean remoteOnly = false;

    @Column(name = "date_posted_within_days", nullable = false)
    private Integer datePostedWithinDays = 3;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
