package com.profilebuilder.repository;

import com.profilebuilder.model.entity.CoverLetterEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoverLetterEvaluationRepository extends JpaRepository<CoverLetterEvaluation, Long> {
    Optional<CoverLetterEvaluation> findByCoverLetterId(Long coverLetterId);
}
