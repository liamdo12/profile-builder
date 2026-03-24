package com.profilebuilder.service;

import com.profilebuilder.model.entity.CrawlSchedule;
import com.profilebuilder.repository.CrawlScheduleRepository;
import com.profilebuilder.repository.CrawledJobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Polls the database every 60s for crawl schedules that are due for execution.
 * Updates next_crawl_at before async execution to prevent double-triggers.
 * Also runs daily retention cleanup to delete old crawled jobs.
 */
@Service
public class CrawlSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(CrawlSchedulerService.class);

    private final CrawlScheduleRepository crawlScheduleRepository;
    private final CrawlOrchestrationService orchestrationService;
    private final CrawledJobRepository crawledJobRepository;

    @Value("${app.crawler.retention-days:30}")
    private int retentionDays;

    public CrawlSchedulerService(CrawlScheduleRepository crawlScheduleRepository,
                                 CrawlOrchestrationService orchestrationService,
                                 CrawledJobRepository crawledJobRepository) {
        this.crawlScheduleRepository = crawlScheduleRepository;
        this.orchestrationService = orchestrationService;
        this.crawledJobRepository = crawledJobRepository;
    }

    /** Polls for due schedules every 60 seconds. */
    @Scheduled(fixedDelay = 60000)
    public void pollDueSchedules() {
        List<CrawlSchedule> dueSchedules = crawlScheduleRepository
                .findByEnabledTrueAndNextCrawlAtBefore(LocalDateTime.now());

        if (dueSchedules.isEmpty()) return;

        log.info("Found {} due crawl schedules", dueSchedules.size());

        for (CrawlSchedule schedule : dueSchedules) {
            // Advance next_crawl_at immediately to prevent re-processing
            schedule.setNextCrawlAt(
                    LocalDateTime.now().plusHours(schedule.getIntervalHours()));
            crawlScheduleRepository.save(schedule);

            // Execute crawl asynchronously
            orchestrationService.executeCrawlForUser(schedule.getUserId());
        }
    }

    /** Deletes crawled jobs older than the configured retention period. Runs daily at 3 AM UTC. */
    @Scheduled(cron = "0 0 3 * * *", zone = "UTC")
    @Transactional
    public void cleanupOldJobs() {
        if (retentionDays < 1) {
            log.error("Invalid retention-days: {}. Skipping cleanup.", retentionDays);
            return;
        }
        LocalDateTime cutoff = LocalDateTime.now(ZoneOffset.UTC).minusDays(retentionDays);
        int deleted = crawledJobRepository.deleteByCreatedAtBefore(cutoff);
        log.info("Retention cleanup: deleted {} jobs older than {} days", deleted, retentionDays);
    }
}
