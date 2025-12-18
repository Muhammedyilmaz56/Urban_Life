from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.assignment_model import AssignmentStatus


class AssignmentBase(BaseModel):
    complaint_id: int
    employee_id: int


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentStatusUpdate(BaseModel):
    status: AssignmentStatus
    solution_photo_url: Optional[str] = None


class AssignmentOut(BaseModel):
    id: int
    complaint_id: int
    employee_id: int
    status: AssignmentStatus
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    solution_photo_url: Optional[str] = None

    class Config:
        from_attributes = True
