from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from app.models.startup_profile import StageEnum

class StartupProfileBase(BaseModel):
    company_name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    stage: Optional[StageEnum] = None
    country: Optional[str] = None
    team_size: Optional[int] = None
    founded_year: Optional[int] = None
    support_needed: Optional[List[str]] = None
    website: Optional[str] = None

class StartupProfileCreate(StartupProfileBase):
    pass

class StartupProfileUpdate(StartupProfileBase):
    pass

class StartupProfileResponse(StartupProfileBase):
    id: UUID
    user_id: UUID
    updated_at: datetime

    class Config:
        from_attributes = True
