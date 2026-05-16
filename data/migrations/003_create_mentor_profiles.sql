CREATE TABLE mentor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    industry VARCHAR[],
    expertise_areas VARCHAR[],
    years_experience INTEGER,
    current_company VARCHAR,
    job_title VARCHAR,
    country VARCHAR,
    availability_hours INTEGER,
    mentoring_style TEXT,
    linkedin_url VARCHAR,
    embedding VECTOR(768),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
