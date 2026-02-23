-- Migration: Create users table
-- Date: 2026-02-22

-- Users table
CREATE TABLE IF NOT EXISTS pb_users (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL,
    username        VARCHAR(100)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    role            VARCHAR(20)     NOT NULL DEFAULT 'BASIC',
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pb_users_email    UNIQUE (email),
    CONSTRAINT uq_pb_users_username UNIQUE (username),
    CONSTRAINT chk_pb_users_role    CHECK (role IN ('BASIC', 'PREMIUM', 'ADMIN'))
);

CREATE INDEX IF NOT EXISTS idx_pb_users_email ON pb_users(email);
CREATE INDEX IF NOT EXISTS idx_pb_users_role  ON pb_users(role);

-- NOTE: Admin user seeded by Phase 02 CommandLineRunner (reads ADMIN_PASSWORD env var)
-- NOTE: Password reset tokens table excluded from MVP
