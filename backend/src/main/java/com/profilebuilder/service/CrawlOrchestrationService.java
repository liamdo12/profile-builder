package com.profilebuilder.service;

import com.profilebuilder.model.dto.CrawlerRequest;
import com.profilebuilder.model.dto.CrawlerResponse;
import com.profilebuilder.model.entity.CrawlSchedule;
import com.profilebuilder.model.entity.CrawledJob;
import com.profilebuilder.model.entity.JobSearch;
import com.profilebuilder.model.enums.SourceSite;
import com.profilebuilder.repository.CrawlScheduleRepository;
import com.profilebuilder.repository.CrawledJobRepository;
import com.profilebuilder.repository.JobSearchRepository;
import com.profilebuilder.util.HashUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Orchestrates the full crawl pipeline for a user:
 * load searches -> call crawler -> deduplicate -> persist -> notify.
 */
@Service
public class CrawlOrchestrationService {

    private static final Logger log = LoggerFactory.getLogger(CrawlOrchestrationService.class);
    private static final int MAX_RESULTS_PER_SOURCE = 20;

    private final JobSearchRepository jobSearchRepository;
    private final CrawledJobRepository crawledJobRepository;
    private final CrawlScheduleRepository crawlScheduleRepository;
    private final CrawlerClientService crawlerClientService;
    private final TelegramNotificationService telegramNotificationService;

    public CrawlOrchestrationService(JobSearchRepository jobSearchRepository,
                                     CrawledJobRepository crawledJobRepository,
                                     CrawlScheduleRepository crawlScheduleRepository,
                                     CrawlerClientService crawlerClientService,
                                     TelegramNotificationService telegramNotificationService) {
        this.jobSearchRepository = jobSearchRepository;
        this.crawledJobRepository = crawledJobRepository;
        this.crawlScheduleRepository = crawlScheduleRepository;
        this.crawlerClientService = crawlerClientService;
        this.telegramNotificationService = telegramNotificationService;
    }

    /**
     * Executes the full crawl pipeline for a user asynchronously.
     * Loads enabled searches, calls crawler, deduplicates, persists, and notifies.
     */
    @Async("crawlTaskExecutor")
    public void executeCrawlForUser(Long userId) {
        log.info("Starting crawl for user {}", userId);
        long start = System.currentTimeMillis();

        try {
            List<JobSearch> searches = jobSearchRepository.findByUserIdAndEnabledTrue(userId);
            if (searches.isEmpty()) {
                log.info("No enabled searches for user {}", userId);
                return;
            }

            List<CrawledJob> allNewJobs = new ArrayList<>();

            for (JobSearch search : searches) {
                CrawlerRequest request = buildRequest(search);
                CrawlerResponse response = crawlerClientService.crawl(request);

                if (response.isSuccess() && response.getJobs() != null) {
                    List<CrawledJob> newJobs = deduplicateAndPersist(
                            userId, search.getId(), response.getJobs());
                    allNewJobs.addAll(newJobs);
                }

                if (response.getErrors() != null) {
                    response.getErrors().forEach(err ->
                            log.warn("Crawler error for source {}: {}", err.getSource(), err.getMessage()));
                }
            }

            if (!allNewJobs.isEmpty()) {
                telegramNotificationService.notifyNewJobs(userId, allNewJobs);
            }

            long duration = System.currentTimeMillis() - start;
            log.info("Crawl complete for user {}: {} new jobs found in {}ms",
                    userId, allNewJobs.size(), duration);
        } catch (Exception e) {
            log.error("Crawl failed for user {}: {}", userId, e.getMessage(), e);
        } finally {
            updateScheduleTimestamps(userId);
        }
    }

    // ── Private helpers ──────────────────────────────────────

    private CrawlerRequest buildRequest(JobSearch search) {
        List<String> sources = Arrays.asList(
                SourceSite.LINKEDIN.name(), SourceSite.INDEED.name(), SourceSite.GITHUB.name());
        return new CrawlerRequest(
                search.getJobTitle(),
                search.getLocation(),
                search.getDatePostedWithinDays(),
                sources,
                MAX_RESULTS_PER_SOURCE
        );
    }

    /** Deduplicates jobs by source_url_hash and persists new ones. */
    List<CrawledJob> deduplicateAndPersist(Long userId, Long searchId,
                                           List<CrawlerResponse.CrawledJobDto> jobs) {
        List<CrawledJob> newJobs = new ArrayList<>();

        for (CrawlerResponse.CrawledJobDto dto : jobs) {
            if (dto.getSourceUrl() == null || dto.getSourceUrl().isBlank()) continue;

            String hash = HashUtil.sha256(dto.getSourceUrl());
            if (crawledJobRepository.existsByUserIdAndSourceUrlHash(userId, hash)) {
                continue;
            }

            CrawledJob entity = new CrawledJob();
            entity.setUserId(userId);
            entity.setJobSearchId(searchId);
            entity.setTitle(dto.getTitle() != null ? dto.getTitle().trim() : "Untitled");
            entity.setCompany(dto.getCompany() != null ? dto.getCompany().trim() : null);
            entity.setLocation(dto.getLocation() != null ? dto.getLocation().trim() : null);
            entity.setSalaryInfo(dto.getSalaryInfo());
            entity.setDatePosted(parseDate(dto.getDatePosted()));
            entity.setDescription(dto.getDescription());
            entity.setSourceUrl(dto.getSourceUrl());
            entity.setSourceUrlHash(hash);
            entity.setSourceSite(parseSourceSite(dto.getSourceSite()));
            entity.setIsNotified(false);

            newJobs.add(crawledJobRepository.save(entity));
        }

        return newJobs;
    }

    private void updateScheduleTimestamps(Long userId) {
        crawlScheduleRepository.findByUserId(userId).ifPresent(schedule -> {
            schedule.setLastCrawlAt(LocalDateTime.now());
            crawlScheduleRepository.save(schedule);
        });
    }

    private SourceSite parseSourceSite(String source) {
        try {
            return SourceSite.valueOf(source);
        } catch (Exception e) {
            return SourceSite.LINKEDIN;
        }
    }

    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return LocalDateTime.now();
        try {
            return ZonedDateTime.parse(dateStr, DateTimeFormatter.ISO_DATE_TIME).toLocalDateTime();
        } catch (Exception e) {
            return LocalDateTime.now();
        }
    }
}
