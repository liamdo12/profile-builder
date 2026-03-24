package com.profilebuilder.service;

import com.profilebuilder.exception.ResourceNotFoundException;
import com.profilebuilder.model.dto.CrawledJobResponse;
import com.profilebuilder.model.entity.CrawledJob;
import com.profilebuilder.model.enums.SourceSite;
import com.profilebuilder.repository.CrawledJobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Business logic for crawled job listing operations. All methods scoped to userId.
 */
@Service
public class CrawledJobService {

    private final CrawledJobRepository repository;
    private final CrawlOrchestrationService orchestrationService;

    public CrawledJobService(CrawledJobRepository repository,
                             CrawlOrchestrationService orchestrationService) {
        this.repository = repository;
        this.orchestrationService = orchestrationService;
    }

    /** Lists crawled jobs with optional source filter and pagination. */
    public Page<CrawledJobResponse> listByUser(Long userId, String sourceSite, Pageable pageable) {
        Page<CrawledJob> page;
        if (sourceSite != null && !sourceSite.isBlank()) {
            SourceSite site;
            try {
                site = SourceSite.valueOf(sourceSite.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid source site: " + sourceSite);
            }
            page = repository.findByUserIdAndSourceSiteOrderByDatePostedDesc(userId, site, pageable);
        } else {
            page = repository.findByUserIdOrderByDatePostedDesc(userId, pageable);
        }
        return page.map(this::toResponse);
    }

    /** Triggers an immediate crawl for the user (async). */
    public void triggerCrawlNow(Long userId) {
        orchestrationService.executeCrawlForUser(userId);
    }

    public void delete(Long id, Long userId) {
        CrawledJob entity = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Crawled job not found with id: " + id));
        repository.delete(entity);
    }

    private CrawledJobResponse toResponse(CrawledJob job) {
        return new CrawledJobResponse(
                job.getId(), job.getTitle(), job.getCompany(), job.getLocation(),
                job.getSalaryInfo(), job.getDatePosted(), job.getDescription(),
                job.getSourceUrl(), job.getSourceSite().name(), job.getCreatedAt());
    }
}
