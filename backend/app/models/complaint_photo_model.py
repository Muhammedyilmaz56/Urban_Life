from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from .base import Base


class ComplaintPhoto(Base):
    __tablename__ = "complaint_photos"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    photo_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    
    complaint = relationship("Complaint", back_populates="photos")
