from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from uuid import UUID
from app.models.milestone import MilestoneStatusEnum

class MilestoneBase(BaseModel):
    link_id: UUID
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[MilestoneStatusEnum] = None

class MilestoneResponse(MilestoneBase):
    id: UUID
    status: MilestoneStatusEnum
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
