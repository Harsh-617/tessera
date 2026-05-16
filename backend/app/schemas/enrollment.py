from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from app.models.enrollment import RoleInProgrammeEnum

class EnrollmentBase(BaseModel):
    programme_id: UUID
    user_id: UUID
    role_in_programme: RoleInProgrammeEnum

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentResponse(EnrollmentBase):
    id: UUID
    enrolled_at: datetime

    class Config:
        from_attributes = True
