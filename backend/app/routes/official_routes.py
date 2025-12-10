from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.utils.db import get_db
from app.routes.auth_routes import get_current_user, role_required
from app.models.user_model import User, UserRole
from app.models.complaint_model import Complaint
from app.models.category_model import Category
from app.schemas.complaint_schema import (
    ComplaintOut,
    ComplaintUpdateStatus,
    ComplaintSupportOut,
)
from app.schemas.category_schema import CategoryCreate, CategoryUpdate, CategoryOut

router = APIRouter(prefix="/official", tags=["Official / Manager"])

@router.get("/complaints", response_model=List[ComplaintOut])
def list_complaints_for_official(
    status: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    query = db.query(Complaint)

    if status:
        query = query.filter(Complaint.status == status)

    if category_id:
        query = query.filter(Complaint.category_id == category_id)

    return query.order_by(Complaint.created_at.desc()).all()

@router.get("/complaints/{complaint_id}", response_model=ComplaintOut)
def get_complaint_detail(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

    return complaint
@router.post("/complaints/{complaint_id}/reject", response_model=ComplaintOut)
def reject_complaint(
    complaint_id: int,
    reason: str = Query(..., min_length=3, max_length=300),
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

    complaint.status = "rejected"
    complaint.reject_reason = reason
    db.commit()
    db.refresh(complaint)

    return complaint

@router.post("/complaints/{complaint_id}/assign", response_model=ComplaintOut)
def assign_complaint_to_employee(
    complaint_id: int,
    employee_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    employee = db.query(User).filter(User.id == employee_id, User.role == UserRole.employee).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

    if not employee:
        raise HTTPException(status_code=404, detail="Çalışan bulunamadı.")

    complaint.assigned_to = employee_id
    complaint.status = "assigned"

    db.commit()
    db.refresh(complaint)

    return complaint
@router.get("/complaints/{complaint_id}/supports", response_model=List[ComplaintSupportOut])
def get_supports(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

    return complaint.supports
@router.get("/categories", response_model=List[CategoryOut])
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    return db.query(Category).order_by(Category.id.desc()).all()
@router.post("/categories", response_model=CategoryOut)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    new_category = Category(**data.dict())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category
@router.put("/categories/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı.")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)

    return category
@router.delete("/categories/{category_id}", status_code=204)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı.")

    db.delete(category)
    db.commit()

