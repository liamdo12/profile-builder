-- ============================================================
-- Migration: Drop JD analysis and generated resume tables
-- Date: 2026-02-21
-- Description: Removes JD analysis feature tables. The Analyze JD
--              and manual Build Resume features have been removed.
-- ============================================================

-- Drop in FK dependency order
DROP TABLE IF EXISTS pb_resume_line_items CASCADE;
DROP TABLE IF EXISTS pb_generated_resumes CASCADE;
DROP TABLE IF EXISTS pb_jd_analyses CASCADE;
