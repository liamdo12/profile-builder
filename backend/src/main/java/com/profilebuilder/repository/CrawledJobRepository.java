package com.profilebuilder.repository;

import com.profilebuilder.model.entity.CrawledJob;
import com.profilebuilder.model.enums.SourceSite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for crawled job listings with dedup and pagination support.
 */
@Repository
public interface CrawledJobRepository extends JpaRepository<CrawledJob, Long> {

    Page<CrawledJob> findByUserIdOrderByDatePostedDesc(Long userId, Pageable pageable);

    Page<CrawledJob> findByUserIdAndSourceSiteOrderByDatePostedDesc(Long userId, SourceSite sourceSite, Pageable pageable);

    boolean existsByUserIdAndSourceUrlHash(Long userId, String sourceUrlHash);

    List<CrawledJob> findByUserIdAndIsNotifiedFalse(Long userId);

    Optional<CrawledJob> findByIdAndUserId(Long id, Long userId);

    /** Delete jobs older than the given date for 30-day retention cleanup. */
    @Modifying
    @Query("DELETE FROM CrawledJob c WHERE c.createdAt < :cutoff")
    int deleteByCreatedAtBefore(LocalDateTime cutoff);
}
