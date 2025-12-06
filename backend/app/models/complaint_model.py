from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.models.complaint_photo_model import ComplaintPhoto
from .base import Base
from .category_model import Category

photos = relationship("ComplaintPhoto", back_populates="complaint")

class ComplaintStatus(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"
    


class Priority(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    
    title = Column(String, nullable=True)  

    description = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.pending, nullable=False)
    priority = Column(Enum(Priority), default=Priority.medium, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    
    photo_url = Column(String, nullable=True)

    
    is_anonymous = Column(Boolean, default=False, nullable=False)

    
    support_count = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", backref="complaints")
    category = relationship("Category", back_populates="complaints")
    photos = relationship("ComplaintPhoto", back_populates="complaint", cascade="all, delete")