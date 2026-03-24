package com.profilebuilder.repository;

import com.profilebuilder.model.entity.JobSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for user job search configurations.
 */
@Repository
public interface JobSearchRepository extends JpaRepository<JobSearch, Long> {

    List<JobSearch> findByUserId(Long userId);

    List<JobSearch> findByUserIdAndEnabledTrue(Long userId);

    Optional<JobSearch> findByIdAndUserId(Long id, Long userId);
}
