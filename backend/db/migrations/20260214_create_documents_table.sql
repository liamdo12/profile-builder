-- ============================================================
-- Migration: Create documents table
-- Date: 2026-02-14
-- Description: Stores metadata for uploaded files (resumes, cover letters).
--              Actual files are stored on disk; file_path references the location.
-- ============================================================

DROP TABLE IF EXISTS pb_documents;

CREATE TABLE pb_documents (
    id              BIGSERIAL       PRIMARY KEY,
    file_name       VARCHAR(255)    NOT NULL,
    original_name   VARCHAR(255)    NOT NULL,
    file_path       VARCHAR(512)    NOT NULL,
    file_type       VARCHAR(255)    NOT NULL,
    document_type   VARCHAR(20)     NOT NULL,
    file_size       BIGINT          NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Index for querying by document type
CREATE INDEX IF NOT EXISTS idx_pb_documents_document_type ON pb_documents (document_type);
