CREATE TYPE link_type AS ENUM ('mentor_startup', 'company_programme', 'partner_initiative');
CREATE TYPE link_status AS ENUM ('proposed', 'active', 'at_risk', 'completed', 'failed');
CREATE TYPE link_outcome AS ENUM ('successful', 'unsuccessful');

CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID REFERENCES programmes(id) ON DELETE CASCADE,
    link_type link_type NOT NULL,
    entity_a_id UUID REFERENCES users(id),
    entity_b_id UUID REFERENCES users(id),
    status link_status DEFAULT 'proposed',
    health_score FLOAT,
    embedding_score FLOAT,
    dna_score FLOAT,
    combined_score FLOAT,
    match_reasoning TEXT,
    created_by UUID REFERENCES users(id),
    proposed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP,
    completed_at TIMESTAMP,
    outcome link_outcome,
    outcome_notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
