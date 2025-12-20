from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from .base import Base


class ComplaintResolutionPhoto(Base):
    __tablename__ = "complaint_resolution_photos"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    photo_url = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    complaint = relationship("Complaint", back_populates="resolution_photos")