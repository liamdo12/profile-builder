package com.profilebuilder.repository;

import com.profilebuilder.model.entity.SmartHrValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SmartHrValidationRepository extends JpaRepository<SmartHrValidation, Long> {
    Optional<SmartHrValidation> findBySmartResumeId(Long smartResumeId);
}
