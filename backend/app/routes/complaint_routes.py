from fastapi import APIRouter, Depends, HTTPException, status,UploadFile, File
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
import time
from pathlib import Path
import os


from app.models.complaint_model import ComplaintPhoto

MEDIA_ROOT = Path("media")
UPLOAD_DIR = Path("media/complaints")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

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
            detail="Profil bilgilerinizi tamamlamadan şikayet oluşturamazsınız.",
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
@router.post("/{complaint_id}/photos", response_model=List[ComplaintPhotoOut])
async def upload_complaint_photos(
    complaint_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = complaint_service.get_complaint_by_id(db, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

   
    if complaint.user_id != current_user.id and current_user.role not in [
        UserRole.admin,
        UserRole.official,
        UserRole.employee,  
    ]:
        raise HTTPException(
            status_code=403,
            detail="Bu şikayete fotoğraf ekleme yetkiniz yok.",
        )

    saved_photos = []

    for f in files:
        timestamp = int(time.time())
        safe_name = f"complaint_{complaint_id}_{timestamp}_{f.filename}"
        file_path = UPLOAD_DIR / safe_name

        content = await f.read()
        with open(file_path, "wb") as out:
            out.write(content)

        public_path = f"/media/complaints/{safe_name}"

        photo = complaint_service.add_photo(
            db,
            complaint_id=complaint_id,
            photo_url=public_path,  
        )
        saved_photos.append(photo)

    return saved_photos


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

@router.delete("/{complaint_id}", status_code=204)
def delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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
            detail="Bu şikayeti silme yetkiniz yok.",
        )

    complaint_service.delete_complaint(db, complaint_id)  
    return


@router.delete("/photos/{photo_id}", status_code=204)
def delete_complaint_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    photo = db.query(ComplaintPhoto).filter(ComplaintPhoto.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Fotoğraf bulunamadı.")

    complaint = complaint_service.get_complaint_by_id(db, photo.complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

    if complaint.user_id != current_user.id and current_user.role not in [
        UserRole.admin,
        UserRole.official,
        UserRole.employee,
    ]:
        raise HTTPException(
            status_code=403,
            detail="Bu fotoğrafı silme yetkiniz yok.",
        )

    
    if photo.photo_url and photo.photo_url.startswith("/media/"):
        file_path = MEDIA_ROOT / photo.photo_url.replace("/media/", "")
        if file_path.exists():
            file_path.unlink()

    complaint_service.delete_photo(db, photo_id)  
    return
@router.get("/{complaint_id}/photos", response_model=List[ComplaintPhotoOut])
def get_complaint_photos(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Şikayet bulunamadı.")

    # Yetki kontrolü (kimler görebilir)
    if (
        complaint.user_id != current_user.id
        and current_user.role not in [
            UserRole.admin,
            UserRole.official,
            UserRole.employee,
        ]
    ):
        raise HTTPException(
            status_code=403,
            detail="Bu şikayetin fotoğraflarını görme yetkiniz yok.",
        )

    photos = (
        db.query(ComplaintPhoto)
        .filter(ComplaintPhoto.complaint_id == complaint_id)
        .order_by(ComplaintPhoto.created_at.asc())
        .all()
    )

    return photos
