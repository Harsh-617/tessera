from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pgvector.sqlalchemy import Vector
from datetime import datetime
import uuid
import enum
from app.database import Base
from app.models.programme import ProgrammeTypeEnum

class DNABlueprint(Base):
    __tablename__ = "dna_blueprints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_link_id = Column(UUID(as_uuid=True), ForeignKey("links.id"), nullable=False)
    programme_type = Column(SQLEnum(ProgrammeTypeEnum), nullable=False)
    industry = Column(String, nullable=False)
    geography = Column(String, nullable=True)
    mentor_snapshot = Column(JSONB, nullable=False)
    startup_snapshot = Column(JSONB, nullable=False)
    relationship_stats = Column(JSONB, nullable=False)
    outcome_metrics = Column(JSONB, nullable=False)
    pattern_summary = Column(Text, nullable=False)
    embedding = Column(Vector(3072), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
