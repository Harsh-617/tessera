CREATE TYPE event_trigger AS ENUM ('system', 'admin', 'user');

CREATE TABLE link_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    from_status VARCHAR,
    to_status VARCHAR,
    triggered_by event_trigger NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
