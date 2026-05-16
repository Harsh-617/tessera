from pydantic import BaseModel
from typing import Any, Dict, Optional
from datetime import datetime
from uuid import UUID
from app.models.programme import ProgrammeTypeEnum

class DNABlueprintBase(BaseModel):
    source_link_id: UUID
    programme_type: ProgrammeTypeEnum
    industry: str
    geography: Optional[str] = None
    mentor_snapshot: Dict[str, Any]
    startup_snapshot: Dict[str, Any]
    relationship_stats: Dict[str, Any]
    outcome_metrics: Dict[str, Any]
    pattern_summary: str

class DNABlueprintResponse(DNABlueprintBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
