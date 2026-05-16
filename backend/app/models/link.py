from sqlalchemy import Column, Float, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
import enum
from app.database import Base

class LinkTypeEnum(enum.Enum):
    mentor_startup = "mentor_startup"
    company_programme = "company_programme"
    partner_initiative = "partner_initiative"

class LinkStatusEnum(enum.Enum):
    proposed = "proposed"
    active = "active"
    at_risk = "at_risk"
    completed = "completed"
    failed = "failed"

class OutcomeEnum(enum.Enum):
    successful = "successful"
    unsuccessful = "unsuccessful"

class Link(Base):
    __tablename__ = "links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    programme_id = Column(UUID(as_uuid=True), ForeignKey("programmes.id"), nullable=False)
    link_type = Column(SQLEnum(LinkTypeEnum), nullable=False)
    entity_a_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    entity_b_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(SQLEnum(LinkStatusEnum), default=LinkStatusEnum.proposed)
    health_score = Column(Float, nullable=True)
    embedding_score = Column(Float, nullable=True)
    dna_score = Column(Float, nullable=True)
    combined_score = Column(Float, nullable=True)
    match_reasoning = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    proposed_at = Column(DateTime, default=datetime.utcnow)
    activated_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    outcome = Column(SQLEnum(OutcomeEnum), nullable=True)
    outcome_notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
