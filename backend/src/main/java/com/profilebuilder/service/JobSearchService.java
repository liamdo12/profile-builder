package com.profilebuilder.service;

import com.profilebuilder.exception.ResourceNotFoundException;
import com.profilebuilder.model.dto.JobSearchRequest;
import com.profilebuilder.model.dto.JobSearchResponse;
import com.profilebuilder.model.entity.JobSearch;
import com.profilebuilder.repository.JobSearchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Business logic for job search CRUD operations. All methods scoped to userId.
 */
@Service
public class JobSearchService {

    private final JobSearchRepository repository;

    public JobSearchService(JobSearchRepository repository) {
        this.repository = repository;
    }

    public JobSearchResponse create(JobSearchRequest req, Long userId) {
        JobSearch entity = new JobSearch();
        entity.setUserId(userId);
        entity.setJobTitle(req.getJobTitle());
        entity.setLocation(req.getLocation());
        entity.setRemoteOnly(req.getRemoteOnly() != null ? req.getRemoteOnly() : false);
        entity.setDatePostedWithinDays(req.getDatePostedWithinDays() != null ? req.getDatePostedWithinDays() : 3);
        entity.setEnabled(true);
        return toResponse(repository.save(entity));
    }

    public List<JobSearchResponse> listByUser(Long userId) {
        return repository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    public JobSearchResponse update(Long id, JobSearchRequest req, Long userId) {
        JobSearch entity = findOwned(id, userId);
        if (req.getJobTitle() != null) entity.setJobTitle(req.getJobTitle());
        if (req.getLocation() != null) entity.setLocation(req.getLocation());
        if (req.getRemoteOnly() != null) entity.setRemoteOnly(req.getRemoteOnly());
        if (req.getDatePostedWithinDays() != null) entity.setDatePostedWithinDays(req.getDatePostedWithinDays());
        return toResponse(repository.save(entity));
    }

    public void toggleEnabled(Long id, Long userId) {
        JobSearch entity = findOwned(id, userId);
        entity.setEnabled(!entity.getEnabled());
        repository.save(entity);
    }

    public void delete(Long id, Long userId) {
        JobSearch entity = findOwned(id, userId);
        repository.delete(entity);
    }

    private JobSearch findOwned(Long id, Long userId) {
        return repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job search not found with id: " + id));
    }

    private JobSearchResponse toResponse(JobSearch entity) {
        return new JobSearchResponse(
                entity.getId(), entity.getJobTitle(), entity.getLocation(),
                entity.getRemoteOnly(), entity.getDatePostedWithinDays(),
                entity.getEnabled(), entity.getCreatedAt());
    }
}
