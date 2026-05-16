from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid
import enum
from app.database import Base

class ProgrammeTypeEnum(enum.Enum):
    accelerator = "accelerator"
    mentorship = "mentorship"
    grant = "grant"
    incubator = "incubator"

class ProgrammeStatusEnum(enum.Enum):
    draft = "draft"
    active = "active"
    completed = "completed"

class Programme(Base):
    __tablename__ = "programmes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(SQLEnum(ProgrammeTypeEnum), nullable=False)
    country = Column(String, nullable=True)
    status = Column(SQLEnum(ProgrammeStatusEnum), default=ProgrammeStatusEnum.draft)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    rules = Column(JSONB, nullable=True)
    success_metrics = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
