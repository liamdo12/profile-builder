package com.profilebuilder.service;

import com.profilebuilder.model.dto.CrawlScheduleRequest;
import com.profilebuilder.model.dto.CrawlScheduleResponse;
import com.profilebuilder.model.entity.CrawlSchedule;
import com.profilebuilder.repository.CrawlScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Business logic for per-user crawl schedule configuration.
 * Creates a default schedule (3h interval, disabled) if none exists.
 */
@Service
public class CrawlScheduleService {

    private final CrawlScheduleRepository repository;

    public CrawlScheduleService(CrawlScheduleRepository repository) {
        this.repository = repository;
    }

    /** Returns existing schedule or creates a default (disabled) one. */
    public CrawlScheduleResponse getOrCreate(Long userId) {
        CrawlSchedule schedule = repository.findByUserId(userId)
                .orElseGet(() -> {
                    CrawlSchedule s = new CrawlSchedule();
                    s.setUserId(userId);
                    s.setIntervalHours(3);
                    s.setEnabled(false);
                    return repository.save(s);
                });
        return toResponse(schedule);
    }

    /** Updates interval and enabled flag, recomputes next_crawl_at. */
    public CrawlScheduleResponse update(CrawlScheduleRequest req, Long userId) {
        CrawlSchedule schedule = repository.findByUserId(userId)
                .orElseGet(() -> {
                    CrawlSchedule s = new CrawlSchedule();
                    s.setUserId(userId);
                    return s;
                });

        if (req.getIntervalHours() != null) schedule.setIntervalHours(req.getIntervalHours());
        if (req.getEnabled() != null) {
            schedule.setEnabled(req.getEnabled());
            // Compute next_crawl_at when enabling
            if (req.getEnabled() && schedule.getNextCrawlAt() == null) {
                schedule.setNextCrawlAt(LocalDateTime.now().plusHours(schedule.getIntervalHours()));
            }
        }

        return toResponse(repository.save(schedule));
    }

    private CrawlScheduleResponse toResponse(CrawlSchedule s) {
        return new CrawlScheduleResponse(
                s.getId(), s.getIntervalHours(), s.getEnabled(),
                s.getLastCrawlAt(), s.getNextCrawlAt());
    }
}
