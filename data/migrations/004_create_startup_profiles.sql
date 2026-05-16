CREATE TYPE startup_stage AS ENUM ('idea', 'mvp', 'seed', 'series_a', 'series_b');

CREATE TABLE startup_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR NOT NULL,
    description TEXT,
    industry VARCHAR,
    stage startup_stage,
    country VARCHAR,
    team_size INTEGER,
    founded_year INTEGER,
    support_needed VARCHAR[],
    website VARCHAR,
    embedding VECTOR(768),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
