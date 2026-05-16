from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.user import RoleEnum

class UserBase(BaseModel):
    firebase_uid: str
    email: EmailStr
    full_name: Optional[str] = None
    role: RoleEnum
    is_active: bool = True

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
