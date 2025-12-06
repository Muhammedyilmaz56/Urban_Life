from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.assignment_model import Assignment, AssignmentStatus
from app.models.user_model import User, UserRole
from app.models.complaint_model import Complaint, ComplaintStatus


ALLOWED_ASSIGNMENT_TRANSITIONS = {
    AssignmentStatus.assigned: {AssignmentStatus.in_progress},
    AssignmentStatus.in_progress: {AssignmentStatus.completed},
    AssignmentStatus.completed: set(),
}


def _parse_assignment_status(value) -> AssignmentStatus:
    if isinstance(value, AssignmentStatus):
        return value
    try:
        return AssignmentStatus(value)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Geçersiz assignment status: {value}",
        )


def _ensure_assignment_transition(current_status: AssignmentStatus, new_status: AssignmentStatus):
    if new_status == current_status:
        return
    allowed_next = ALLOWED_ASSIGNMENT_TRANSITIONS.get(current_status, set())
    if new_status not in allowed_next:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{current_status.value} durumundan {new_status.value} durumuna geçilemez.",
        )


def _sync_complaint_status_with_assignment(complaint: Complaint, new_assignment_status: AssignmentStatus):
    """
    Görev durumu değişince ilgili şikayet status'unu senkron et.
    """
    if new_assignment_status == AssignmentStatus.in_progress:
        complaint.status = ComplaintStatus.in_progress
    elif new_assignment_status == AssignmentStatus.completed:
        complaint.status = ComplaintStatus.resolved



def assign_complaint_to_employee(
    db: Session,
    complaint_id: int,
    employee_id: int,
):
    
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Şikayet bulunamadı.",
        )

    
    employee = db.query(User).filter(User.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Çalışan kullanıcı bulunamadı.",
        )

    if employee.role != UserRole.employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sadece çalışan rolüne sahip kullanıcıya görev atanabilir.",
        )

    
    existing = (
        db.query(Assignment)
        .filter(Assignment.complaint_id == complaint_id)
        .order_by(Assignment.id.desc())
        .first()
    )

    if existing and existing.status != AssignmentStatus.completed:
        
        existing.employee_id = employee_id
        existing.status = AssignmentStatus.assigned
        existing.start_time = None
        existing.end_time = None
        existing.solution_photo_url = None
        _sync_complaint_status_with_assignment(complaint, AssignmentStatus.assigned)
        db.commit()
        db.refresh(existing)
        return existing

    
    assignment = Assignment(
        complaint_id=complaint_id,
        employee_id=employee_id,
        status=AssignmentStatus.assigned,
    )

    _sync_complaint_status_with_assignment(complaint, AssignmentStatus.assigned)

    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


def get_assignments_for_employee(db: Session, employee_id: int):
    return db.query(Assignment).filter(Assignment.employee_id == employee_id).all()


def get_assignment(db: Session, assignment_id: int):
    return db.query(Assignment).filter(Assignment.id == assignment_id).first()


def update_assignment_status(
    db: Session,
    assignment_id: int,
    new_status_raw,
    solution_photo_url: str | None = None,
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        return None

    new_status = _parse_assignment_status(new_status_raw)
    _ensure_assignment_transition(assignment.status, new_status)

    assignment.status = new_status

   
    if new_status == AssignmentStatus.in_progress and assignment.start_time is None:
        assignment.start_time = datetime.utcnow()

    if new_status == AssignmentStatus.completed:
        assignment.end_time = datetime.utcnow()
        if solution_photo_url:
            assignment.solution_photo_url = solution_photo_url

    
    complaint = assignment.complaint
    if complaint:
        _sync_complaint_status_with_assignment(complaint, new_status)

    db.commit()
    db.refresh(assignment)
    return assignment
