package com.profilebuilder.repository;

import com.profilebuilder.model.entity.CrawlSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for per-user crawl scheduling configuration.
 */
@Repository
public interface CrawlScheduleRepository extends JpaRepository<CrawlSchedule, Long> {

    Optional<CrawlSchedule> findByUserId(Long userId);

    /** Find schedules that are enabled and due for execution. */
    List<CrawlSchedule> findByEnabledTrueAndNextCrawlAtBefore(LocalDateTime now);
}
