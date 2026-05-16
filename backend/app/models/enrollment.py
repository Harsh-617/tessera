from sqlalchemy import Column, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
import enum
from app.database import Base

class RoleInProgrammeEnum(enum.Enum):
    mentor = "mentor"
    startup = "startup"
    partner = "partner"

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    programme_id = Column(UUID(as_uuid=True), ForeignKey("programmes.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role_in_programme = Column(SQLEnum(RoleInProgrammeEnum), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
