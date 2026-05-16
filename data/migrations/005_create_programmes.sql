CREATE TYPE programme_type AS ENUM ('accelerator', 'mentorship', 'grant', 'incubator');
CREATE TYPE programme_status AS ENUM ('draft', 'active', 'completed');

CREATE TABLE programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    type programme_type NOT NULL,
    country VARCHAR,
    status programme_status DEFAULT 'draft',
    admin_id UUID REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    rules JSONB,
    success_metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
