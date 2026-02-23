package com.profilebuilder.repository;

import com.profilebuilder.model.entity.Document;
import com.profilebuilder.model.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Document} entities.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByDocumentType(DocumentType documentType);

    List<Document> findByUserId(Long userId);

    List<Document> findByUserIdAndDocumentType(Long userId, DocumentType documentType);

    Optional<Document> findByIdAndUserId(Long id, Long userId);
}
