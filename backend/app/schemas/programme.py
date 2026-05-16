from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import date, datetime
from uuid import UUID
from app.models.programme import ProgrammeTypeEnum, ProgrammeStatusEnum

class ProgrammeBase(BaseModel):
    name: str
    type: ProgrammeTypeEnum
    country: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    rules: Optional[Dict[str, Any]] = None
    success_metrics: Optional[Dict[str, Any]] = None

class ProgrammeCreate(ProgrammeBase):
    pass

class ProgrammeUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[ProgrammeTypeEnum] = None
    country: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    rules: Optional[Dict[str, Any]] = None
    success_metrics: Optional[Dict[str, Any]] = None
    status: Optional[ProgrammeStatusEnum] = None

class ProgrammeResponse(ProgrammeBase):
    id: UUID
    status: ProgrammeStatusEnum
    admin_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
