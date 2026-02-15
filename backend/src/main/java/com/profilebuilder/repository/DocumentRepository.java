package com.profilebuilder.repository;

import com.profilebuilder.model.entity.Document;
import com.profilebuilder.model.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link Document} entities.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByDocumentType(DocumentType documentType);
}
