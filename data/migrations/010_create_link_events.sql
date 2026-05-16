CREATE TYPE link_trigger_source AS ENUM ('system', 'admin', 'user');

CREATE TABLE IF NOT EXISTS link_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    from_status VARCHAR,
    to_status VARCHAR NOT NULL,
    triggered_by link_trigger_source NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
