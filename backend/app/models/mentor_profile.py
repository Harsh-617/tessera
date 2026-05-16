from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from pgvector.sqlalchemy import Vector
from datetime import datetime
import uuid
from app.database import Base

class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    industry = Column(ARRAY(String), nullable=True)
    expertise_areas = Column(ARRAY(String), nullable=True)
    years_experience = Column(Integer, nullable=True)
    current_company = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    country = Column(String, nullable=True)
    availability_hours = Column(Integer, nullable=True)
    mentoring_style = Column(Text, nullable=True)
    linkedin_url = Column(String, nullable=True)
    embedding = Column(Vector(3072), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
