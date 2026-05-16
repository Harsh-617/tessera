from sqlalchemy import Column, Integer, Date, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.database import Base

class CheckIn(Base):
    __tablename__ = "check_ins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    link_id = Column(UUID(as_uuid=True), ForeignKey("links.id"), nullable=False)
    logged_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    session_date = Column(Date, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    topics_discussed = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
