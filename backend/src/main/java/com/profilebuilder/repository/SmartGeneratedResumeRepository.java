package com.profilebuilder.repository;

import com.profilebuilder.model.entity.SmartGeneratedResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SmartGeneratedResumeRepository extends JpaRepository<SmartGeneratedResume, Long> {

    Optional<SmartGeneratedResume> findByIdAndUserId(Long id, Long userId);
}
