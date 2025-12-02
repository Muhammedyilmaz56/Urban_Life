from sqlalchemy import Column, Integer, Enum, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .base import Base


class AssignmentStatus(enum.Enum):
    assigned = "assigned"
    in_progress = "in_progress"
    completed = "completed"


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(AssignmentStatus), default=AssignmentStatus.assigned, nullable=False)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    solution_photo_url = Column(String, nullable=True)

    # İlişkiler
    complaint = relationship("Complaint", backref="assignments")
    employee = relationship("User", backref="assignments")
