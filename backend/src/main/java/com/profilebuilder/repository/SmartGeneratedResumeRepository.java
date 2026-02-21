package com.profilebuilder.repository;

import com.profilebuilder.model.entity.SmartGeneratedResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SmartGeneratedResumeRepository extends JpaRepository<SmartGeneratedResume, Long> {
}
