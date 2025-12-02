from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.utils.db import get_db
from app.services import complaint_service
from app.schemas.complaint_schema import ComplaintUpdateStatus
from app.services.complaint_service import update_complaint_status
from app.routes.auth_routes import role_required
from app.models.user_model import UserRole

from app.schemas.complaint_schema import (
    ComplaintCreate,
    ComplaintOut,
    ComplaintUpdate,
    ComplaintRatingCreate,
    ComplaintSupportOut,
    ComplaintRatingOut,
)

from app.routes.auth_routes import get_current_user, role_required


from app.models.user_model import User, UserRole



router = APIRouter(prefix="/complaints", tags=["Complaints"])


# --- Vatandaş: Şikayet oluştur ---
@router.post("/", response_model=ComplaintOut)
def create_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.citizen:
        raise HTTPException(status_code=403, detail="Sadece vatandaş şikayet oluşturabilir.")
    return complaint_service.create_complaint(db, current_user.id, complaint)


# --- Vatandaş: Kendi şikayetlerini listele ---
@router.get("/my", response_model=List[ComplaintOut])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return complaint_service.get_my_complaints(db, current_user.id)


# --- Yetkili/Admin: Tüm şikayetleri listele ---
@router.get("/", response_model=List[ComplaintOut])
def get_all_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.admin, UserRole.official]:
        raise HTTPException(status_code=403, detail="Sadece admin veya yetkili tüm şikayetleri görebilir.")
    return complaint_service.get_all_complaints(db)


# --- Yetkili/Çalışan: Şikayet durumu güncelle ---
@router.put("/{complaint_id}/status", response_model=ComplaintOut)
def update_complaint_status(
    complaint_id: int,
    data: ComplaintUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.admin, UserRole.official, UserRole.employee]:
        raise HTTPException(status_code=403, detail="Bu işlemi yapma yetkiniz yok.")

    updated = complaint_service.update_complaint_status(db, complaint_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")
    return updated


# --- Vatandaş: Çözülen şikayete puan verme ---
@router.post("/{complaint_id}/rating", response_model=ComplaintRatingOut)
def add_rating(
    complaint_id: int,
    rating: ComplaintRatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return complaint_service.add_rating(db, complaint_id, current_user.id, rating)


# --- Vatandaş: Şikayete destek verme ---
@router.post("/{complaint_id}/support", response_model=ComplaintSupportOut)
def add_support(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return complaint_service.add_support(db, complaint_id, current_user.id)
# --- Yetkili/Çalışan: Şikayet durumu güncelle (sadece durum) ---
@router.patch("/{complaint_id}/status")
def change_complaint_status(
    complaint_id: int,
    status_update: ComplaintUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.employee]))
):
    complaint = update_complaint_status(db, complaint_id, status_update.status.value)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return {"message": "Durum güncellendi", "complaint": complaint}