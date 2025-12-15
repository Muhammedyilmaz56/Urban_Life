from sqlalchemy.orm import Session
from app.models.assignment_model import Assignment, AssignmentStatus
from app.models.complaint_model import Complaint

def get_assigned_complaints(db: Session, employee_user_id: int):
    rows = (
        db.query(Assignment, Complaint)
        .join(Complaint, Complaint.id == Assignment.complaint_id)
        .filter(Assignment.employee_id == employee_user_id)
        .filter(Assignment.status.in_([AssignmentStatus.assigned, AssignmentStatus.in_progress]))
        .order_by(Assignment.id.desc())
        .all()
    )

    return [
        {
            "assignment_id": a.id,
            "assignment_status": a.status.value if hasattr(a.status, "value") else str(a.status),
            "complaint": c,
        }
        for a, c in rows
    ]

def get_completed_complaints(db: Session, employee_user_id: int):
    rows = (
        db.query(Assignment, Complaint)
        .join(Complaint, Complaint.id == Assignment.complaint_id)
        .filter(Assignment.employee_id == employee_user_id)
        .filter(Assignment.status == AssignmentStatus.completed)
        .order_by(Assignment.id.desc())
        .all()
    )

    return [
        {
            "assignment_id": a.id,
            "assignment_status": a.status.value if hasattr(a.status, "value") else str(a.status),
            "solution_photo_url": a.solution_photo_url,
            "complaint": c,
        }
        for a, c in rows
    ]
