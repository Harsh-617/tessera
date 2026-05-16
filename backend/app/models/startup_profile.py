from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from pgvector.sqlalchemy import Vector
from datetime import datetime
import uuid
import enum
from app.database import Base

class StageEnum(enum.Enum):
    idea = "idea"
    mvp = "mvp"
    seed = "seed"
    series_a = "series_a"
    series_b = "series_b"

class StartupProfile(Base):
    __tablename__ = "startup_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    industry = Column(String, nullable=True)
    stage = Column(SQLEnum(StageEnum), nullable=True)
    country = Column(String, nullable=True)
    team_size = Column(Integer, nullable=True)
    founded_year = Column(Integer, nullable=True)
    support_needed = Column(ARRAY(String), nullable=True)
    website = Column(String, nullable=True)
    embedding = Column(Vector(3072), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
