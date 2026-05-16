from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.link import LinkTypeEnum, LinkStatusEnum, OutcomeEnum

class LinkBase(BaseModel):
    programme_id: UUID
    link_type: LinkTypeEnum
    entity_a_id: UUID
    entity_b_id: UUID

class LinkCreate(LinkBase):
    pass

class LinkUpdate(BaseModel):
    status: Optional[LinkStatusEnum] = None
    outcome: Optional[OutcomeEnum] = None
    outcome_notes: Optional[str] = None

class LinkResponse(LinkBase):
    id: UUID
    status: LinkStatusEnum
    health_score: Optional[float] = None
    embedding_score: Optional[float] = None
    dna_score: Optional[float] = None
    combined_score: Optional[float] = None
    match_reasoning: Optional[str] = None
    created_by: UUID
    proposed_at: datetime
    activated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    outcome: Optional[OutcomeEnum] = None
    outcome_notes: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True
