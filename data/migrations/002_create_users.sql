CREATE TYPE user_role AS ENUM ('admin', 'mentor', 'startup', 'partner');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
