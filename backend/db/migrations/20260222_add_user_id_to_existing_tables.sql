-- Migration: Add user_id column to existing tables and backfill with admin
-- Date: 2026-02-22
-- Depends on: 20260222_create_users_table.sql

-- Add user_id to pb_documents
ALTER TABLE pb_documents
    ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES pb_users(id);

CREATE INDEX IF NOT EXISTS idx_pb_documents_user_id ON pb_documents(user_id);

-- Add user_id to pb_smart_generated_resumes
ALTER TABLE pb_smart_generated_resumes
    ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES pb_users(id);

CREATE INDEX IF NOT EXISTS idx_pb_smart_generated_resumes_user_id
    ON pb_smart_generated_resumes(user_id);

-- Add user_id to pb_generated_cover_letters
ALTER TABLE pb_generated_cover_letters
    ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES pb_users(id);

CREATE INDEX IF NOT EXISTS idx_pb_generated_cover_letters_user_id
    ON pb_generated_cover_letters(user_id);

-- Backfill: assign all existing records to admin
UPDATE pb_documents
SET user_id = (SELECT id FROM pb_users WHERE email = 'admin@profilebuilder.com')
WHERE user_id IS NULL;

UPDATE pb_smart_generated_resumes
SET user_id = (SELECT id FROM pb_users WHERE email = 'admin@profilebuilder.com')
WHERE user_id IS NULL;

UPDATE pb_generated_cover_letters
SET user_id = (SELECT id FROM pb_users WHERE email = 'admin@profilebuilder.com')
WHERE user_id IS NULL;

-- Enforce NOT NULL after backfill
ALTER TABLE pb_documents ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE pb_smart_generated_resumes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE pb_generated_cover_letters ALTER COLUMN user_id SET NOT NULL;
