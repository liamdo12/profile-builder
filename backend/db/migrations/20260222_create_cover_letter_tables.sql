-- Migration: Create cover letter generation tables
-- Date: 2026-02-22

CREATE TABLE IF NOT EXISTS pb_generated_cover_letters (
    id                          BIGSERIAL       PRIMARY KEY,
    jd_text                     TEXT            NOT NULL,
    resume_document_id          BIGINT          NOT NULL REFERENCES pb_documents(id),
    cover_letter_document_id    BIGINT          NOT NULL REFERENCES pb_documents(id),
    company_research            JSONB,
    cover_letter_content        TEXT            NOT NULL,
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pb_cover_letter_evaluations (
    id                  BIGSERIAL           PRIMARY KEY,
    cover_letter_id     BIGINT              NOT NULL REFERENCES pb_generated_cover_letters(id),
    match_percentage    DOUBLE PRECISION,
    verdict             TEXT,
    suggestions         JSONB,
    created_at          TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pb_cover_letter_evaluations_cover_letter_id
    ON pb_cover_letter_evaluations(cover_letter_id);
