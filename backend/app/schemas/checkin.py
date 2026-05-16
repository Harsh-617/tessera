from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from uuid import UUID

class CheckInBase(BaseModel):
    link_id: UUID
    session_date: date
    duration_minutes: int
    topics_discussed: Optional[str] = None
    notes: Optional[str] = None

class CheckInCreate(CheckInBase):
    pass

class CheckInResponse(CheckInBase):
    id: UUID
    logged_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True
