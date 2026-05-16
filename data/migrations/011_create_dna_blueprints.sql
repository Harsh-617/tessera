CREATE TABLE dna_blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_link_id UUID REFERENCES links(id) ON DELETE SET NULL,
    programme_type programme_type,
    industry VARCHAR,
    geography VARCHAR,
    mentor_snapshot JSONB,
    startup_snapshot JSONB,
    relationship_stats JSONB,
    outcome_metrics JSONB,
    pattern_summary TEXT,
    embedding VECTOR(768),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
