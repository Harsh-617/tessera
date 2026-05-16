CREATE TYPE enrollment_role AS ENUM ('mentor', 'startup', 'partner');

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID REFERENCES programmes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_in_programme enrollment_role NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(programme_id, user_id)
);
