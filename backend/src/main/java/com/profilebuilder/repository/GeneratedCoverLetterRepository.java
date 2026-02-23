package com.profilebuilder.repository;

import com.profilebuilder.model.entity.GeneratedCoverLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GeneratedCoverLetterRepository extends JpaRepository<GeneratedCoverLetter, Long> {

    Optional<GeneratedCoverLetter> findByIdAndUserId(Long id, Long userId);
}
