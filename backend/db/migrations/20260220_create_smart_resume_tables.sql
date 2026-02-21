-- Migration: Create smart resume generation tables
-- Date: 2026-02-20

CREATE TABLE IF NOT EXISTS pb_smart_generated_resumes (
    id              BIGSERIAL       PRIMARY KEY,
    jd_text         TEXT            NOT NULL,
    document_ids    JSONB           NOT NULL,
    resume_content  TEXT            NOT NULL,
    personal_info   JSONB,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pb_smart_hr_validations (
    id                          BIGSERIAL       PRIMARY KEY,
    smart_resume_id             BIGINT          NOT NULL REFERENCES pb_smart_generated_resumes(id),
    overall_score               DECIMAL(3,1),
    keyword_match_score         DECIMAL(3,2),
    experience_relevance_score  DECIMAL(3,2),
    skills_alignment_score      DECIMAL(3,2),
    resume_quality_score        DECIMAL(3,2),
    education_fit_score         DECIMAL(3,2),
    gaps                        JSONB,
    strengths                   JSONB,
    recommendations             JSONB,
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pb_smart_hr_validations_resume_id
    ON pb_smart_hr_validations(smart_resume_id);
