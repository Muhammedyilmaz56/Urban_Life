from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List,Optional
from fastapi import UploadFile, File,Query
from app.utils.db import get_db
from app.services import complaint_service
from app.schemas.complaint_schema import (
    ComplaintCreate,
    ComplaintOut,
    ComplaintUpdate,
    ComplaintRatingCreate,
    ComplaintSupportOut,
    ComplaintRatingOut,
    ComplaintUpdateStatus,
    ComplaintPhotoOut,
   
)
from app.routes.auth_routes import get_current_user, role_required
from app.models.user_model import User, UserRole
from app.models.category_model import Category
from app.models.complaint_model import Complaint


router = APIRouter(prefix="/complaints", tags=["Complaints"])



@router.post("/", response_model=ComplaintOut, status_code=status.HTTP_201_CREATED)
def create_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.citizen:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece vatandaş şikayet oluşturabilir.",
        )


    if not current_user.profile_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Şikayet oluşturmak için önce profilinizi tamamlamalısınız.",
        )

    category = (
        db.query(Category)
        .filter(Category.id == complaint.category_id, Category.is_active == True)
        .first()
    )
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz veya pasif kategori.",
        )


    return complaint_service.create_complaint(db, current_user.id, complaint)



@router.get("/my", response_model=List[ComplaintOut])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return complaint_service.get_my_complaints(db, current_user.id)


@router.get("/", response_model=List[ComplaintOut])
def get_all_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in [UserRole.admin, UserRole.official]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece admin veya yetkili tüm şikayetleri görebilir.",
        )
    return complaint_service.get_all_complaints(db)



@router.put("/{complaint_id}/status", response_model=ComplaintOut)
def update_complaint_status(
    complaint_id: int,
    data: ComplaintUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in [UserRole.admin, UserRole.official, UserRole.employee]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlemi yapma yetkiniz yok.",
        )

    updated = complaint_service.update_complaint_fields(db, complaint_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")
    return updated



@router.post("/{complaint_id}/rating", response_model=ComplaintRatingOut)
def add_rating(
    complaint_id: int,
    rating: ComplaintRatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return complaint_service.add_rating(db, complaint_id, current_user.id, rating)



@router.post("/{complaint_id}/support")
def toggle_support(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result, error = complaint_service.toggle_support(db, complaint_id, current_user.id)

    if error == "not_found":
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    return {
        "status": result,
         "support_count": complaint.support_count
    }




@router.patch("/{complaint_id}/status", response_model=ComplaintOut)
def change_complaint_status(
    complaint_id: int,
    status_update: ComplaintUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        role_required([UserRole.admin, UserRole.official, UserRole.employee])
    ),
):
    complaint = complaint_service.change_complaint_status(
        db, complaint_id, status_update.status
    )
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")
    return complaint
@router.post("/{complaint_id}/photos", response_model=ComplaintPhotoOut)
async def upload_complaint_photo(
    complaint_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    complaint = complaint_service.get_complaint_by_id(db, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

    if complaint.user_id != current_user.id and current_user.role not in [
        UserRole.admin,
        UserRole.official,
    ]:
        raise HTTPException(
            status_code=403,
            detail="Bu şikayete fotoğraf ekleme yetkiniz yok.",
        )


    file_bytes = await file.read()
    fake_url = f"https://firebase.fake/{file.filename}"  

    saved_photo = complaint_service.add_photo(db, complaint_id, fake_url)

    return saved_photo


@router.get("/feed", response_model=List[ComplaintOut])
def get_complaints_feed(
    db: Session = Depends(get_db),
    sort: Optional[str] = Query("newest"),
):
    query = db.query(Complaint)

    if sort == "newest":
        query = query.order_by(Complaint.created_at.desc())

    elif sort == "oldest":
        query = query.order_by(Complaint.created_at.asc())

    elif sort == "popular": 
        query = query.order_by(
            Complaint.support_count.desc(),
            Complaint.created_at.desc()
        )

    return query.all()


@router.get("/{complaint_id}", response_model=ComplaintOut)
def get_complaint_detail(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = complaint_service.get_complaint_by_id(db, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")
    return complaint

