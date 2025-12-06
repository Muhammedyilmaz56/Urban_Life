from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.utils.db import get_db
from app.routes.auth_routes import get_current_user, role_required
from app.models.user_model import User, UserRole
from app.schemas.assignment_schema import (
    AssignmentCreate,
    AssignmentOut,
    AssignmentStatusUpdate,
)
from app.services import assignment_service

router = APIRouter(prefix="/assignments", tags=["Assignments"])



@router.post("/", response_model=AssignmentOut)
def assign_complaint(
    data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.admin, UserRole.official]))
):
    """
    Bir şikayeti bir çalışan kullanıcıya atar.
    """
    assignment = assignment_service.assign_complaint_to_employee(
        db=db,
        complaint_id=data.complaint_id,
        employee_id=data.employee_id,
    )
    return assignment



@router.get("/my", response_model=List[AssignmentOut])
def get_my_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.employee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece çalışanlar kendi görevlerini listeleyebilir.",
        )

    assignments = assignment_service.get_assignments_for_employee(
        db=db,
        employee_id=current_user.id,
    )
    return assignments



@router.get("/{assignment_id}", response_model=AssignmentOut)
def get_assignment_detail(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assignment = assignment_service.get_assignment(db, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")

    if current_user.role == UserRole.employee and assignment.employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu görevi görüntüleme yetkiniz yok.")

    return assignment



@router.patch("/{assignment_id}/status", response_model=AssignmentOut)
def change_assignment_status(
    assignment_id: int,
    data: AssignmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assignment = assignment_service.get_assignment(db, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")

    if current_user.role == UserRole.employee and assignment.employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu görevi güncelleme yetkiniz yok.")

 

    updated = assignment_service.update_assignment_status(
        db=db,
        assignment_id=assignment_id,
        new_status_raw=data.status,
        solution_photo_url=data.solution_photo_url,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")

    return updated
