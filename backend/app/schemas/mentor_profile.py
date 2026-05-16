from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class MentorProfileBase(BaseModel):
    bio: Optional[str] = None
    industry: Optional[List[str]] = None
    expertise_areas: Optional[List[str]] = None
    years_experience: Optional[int] = None
    current_company: Optional[str] = None
    job_title: Optional[str] = None
    country: Optional[str] = None
    availability_hours: Optional[int] = None
    mentoring_style: Optional[str] = None
    linkedin_url: Optional[str] = None

class MentorProfileCreate(MentorProfileBase):
    pass

class MentorProfileUpdate(MentorProfileBase):
    pass

class MentorProfileResponse(MentorProfileBase):
    id: UUID
    user_id: UUID
    updated_at: datetime

    class Config:
        from_attributes = True
