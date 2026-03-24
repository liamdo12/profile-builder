-- Reference SQL migration for Job Crawler feature tables
-- Note: Hibernate ddl-auto:update handles schema creation; this is for documentation

CREATE TABLE IF NOT EXISTS pb_job_searches (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES pb_users(id),
    job_title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_only BOOLEAN NOT NULL DEFAULT false,
    date_posted_within_days INT NOT NULL DEFAULT 3,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pb_crawled_jobs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES pb_users(id),
    job_search_id BIGINT NOT NULL REFERENCES pb_job_searches(id),
    title VARCHAR(500) NOT NULL,
    company VARCHAR(255),
    location VARCHAR(255),
    salary_info VARCHAR(255),
    date_posted TIMESTAMP,
    description TEXT,
    source_url VARCHAR(1024) NOT NULL,
    source_url_hash VARCHAR(64) NOT NULL,
    source_site VARCHAR(50) NOT NULL,
    is_notified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crawled_jobs_source_url_hash ON pb_crawled_jobs(source_url_hash);
CREATE INDEX IF NOT EXISTS idx_crawled_jobs_date_posted ON pb_crawled_jobs(date_posted);
CREATE INDEX IF NOT EXISTS idx_crawled_jobs_user_id ON pb_crawled_jobs(user_id);

CREATE TABLE IF NOT EXISTS pb_telegram_configs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES pb_users(id),
    chat_id VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pb_crawl_schedules (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES pb_users(id),
    interval_hours INT NOT NULL DEFAULT 3,
    enabled BOOLEAN NOT NULL DEFAULT true,
    last_crawl_at TIMESTAMP,
    next_crawl_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
