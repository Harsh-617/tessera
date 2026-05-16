CREATE TYPE milestone_status AS ENUM ('pending', 'completed', 'overdue');

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    due_date DATE,
    status milestone_status DEFAULT 'pending',
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
