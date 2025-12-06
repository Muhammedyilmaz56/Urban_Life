from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from sqlalchemy import func

from app.models.complaint_model import Complaint, ComplaintStatus, Priority
from app.models.complaint_rating_model import ComplaintRating
from app.models.complaint_support_model import ComplaintSupport
from app.models.category_model import Category

from app.schemas.complaint_schema import (
    ComplaintCreate,
    ComplaintUpdate,
    ComplaintRatingCreate,
    ComplaintSupportCreate,  
)
from app.models.complaint_photo_model import ComplaintPhoto
from app.services.ai_service import predict_category
from app.models.complaint_model import Complaint,ComplaintStatus
from app.models.complaint_support_model import ComplaintSupport




ALLOWED_TRANSITIONS = {
    ComplaintStatus.pending: {ComplaintStatus.in_progress},
    ComplaintStatus.in_progress: {ComplaintStatus.resolved},
    ComplaintStatus.resolved: set(),  
}


def _parse_status(value) -> ComplaintStatus:
    """
    Hem string hem Enum gelebilir, hepsini ComplaintStatus'a çevir.
    """
    if isinstance(value, ComplaintStatus):
        return value
    try:
        return ComplaintStatus(value)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Geçersiz status değeri: {value}",
        )


def _ensure_valid_transition(current_status: ComplaintStatus, new_status: ComplaintStatus):
    """
    pending -> in_progress -> resolved akışını enforce eden kontrol.
    """
    if new_status == current_status:
        return  

    allowed_next = ALLOWED_TRANSITIONS.get(current_status, set())
    if new_status not in allowed_next:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{current_status.value} durumundan {new_status.value} durumuna geçilemez.",
        )





def create_complaint(db: Session, user_id: int, complaint: ComplaintCreate):
    
    category_name = predict_category(complaint.description)

   
    category = db.query(Category).filter(Category.name == category_name).first()
    if not category:
        category = Category(
            name=category_name,
            description=f"{category_name} sorunları"
        )
        db.add(category)
        db.commit()
        db.refresh(category)

    
    new_complaint = Complaint(
        user_id=user_id,
        description=complaint.description,
        category_id=category.id,
        latitude=complaint.latitude,
        longitude=complaint.longitude,
        photo_url=complaint.photo_url,
        status=ComplaintStatus.pending,
        priority=Priority.medium
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint


def get_my_complaints(db: Session, user_id: int):
    return db.query(Complaint).filter(Complaint.user_id == user_id).all()


def get_all_complaints(db: Session):
    return db.query(Complaint).all()


def update_complaint_fields(db: Session, complaint_id: int, data: ComplaintUpdate):
    """
    PUT /complaints/{id}/status endpoint'i burayı kullanacak.
    Buradan:
      - status (workflow kurallı)
      - priority
      - category_id
    güncellenebilir.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        return None

    
    if data.status is not None:
        new_status = _parse_status(data.status)
        _ensure_valid_transition(complaint.status, new_status)
        complaint.status = new_status

   
    if data.priority is not None:
        try:
            complaint.priority = Priority(data.priority)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Geçersiz priority değeri: {data.priority}",
            )

   
    if data.category_id is not None:
        complaint.category_id = data.category_id

    complaint.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(complaint)
    return complaint


def change_complaint_status(db: Session, complaint_id: int, new_status_raw):
    """
    PATCH /complaints/{id}/status endpoint'i için:
    Sadece status değiştirir, pending -> in_progress -> resolved kuralını uygular.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        return None

    new_status = _parse_status(new_status_raw)
    _ensure_valid_transition(complaint.status, new_status)

    complaint.status = new_status
    complaint.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(complaint)
    return complaint





def add_rating(db: Session, complaint_id: int, user_id: int, rating_data: ComplaintRatingCreate):
    rating = ComplaintRating(
        complaint_id=complaint_id,
        user_id=user_id,
        rating=rating_data.rating,
        comment=rating_data.comment,
    )
    db.add(rating)
    db.commit()
    db.refresh(rating)
    return rating





def add_support(db: Session, complaint_id: int, user_id: int):
   
    existing = db.query(ComplaintSupport).filter(
        ComplaintSupport.complaint_id == complaint_id,
        ComplaintSupport.user_id == user_id
    ).first()

    if existing:
        return existing

    support = ComplaintSupport(
        complaint_id=complaint_id,
        user_id=user_id
    )
    db.add(support)
    db.commit()
    db.refresh(support)
    return support
def add_photo(db: Session, complaint_id: int, photo_url: str):
    photo = ComplaintPhoto(
        complaint_id=complaint_id,
        photo_url=photo_url
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo
def get_complaint_by_id(db: Session, complaint_id: int):
    return db.query(Complaint).filter(Complaint.id == complaint_id).first()

def toggle_support(db: Session, complaint_id: int, user_id: int):
  

   
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        return None, "not_found"

    
    existing = (
        db.query(ComplaintSupport)
        .filter(
            ComplaintSupport.complaint_id == complaint_id,
            ComplaintSupport.user_id == user_id
        )
        .first()
    )

    if existing:
       
        db.delete(existing)
        complaint.support_count -= 1
        db.commit()
        return "removed", None

    else:
        
        new_support = ComplaintSupport(
            complaint_id=complaint_id,
            user_id=user_id
        )
        db.add(new_support)
        complaint.support_count += 1
        db.commit()
        return "added", None
    

def get_feed_complaints(
    db: Session,
    sort: str = "newest",
    lat: Optional[float] = None,
    lon: Optional[float] = None,
) -> List[Complaint]:
    """
    Şikayet feed'i:
    - sort=newest  -> en yeni
    - sort=popular -> en çok desteklenen
    - sort=nearby  -> en yakın (lat/lon varsa)
    """


    query = db.query(Complaint)


    if sort == "popular":
        
        query = query.order_by(
            Complaint.support_count.desc(),
            Complaint.created_at.desc(),
        )

    elif sort == "nearby" and lat is not None and lon is not None:
        
        query = query.filter(
            Complaint.latitude.isnot(None),
            Complaint.longitude.isnot(None),
        )

        distance_expr = (
            (Complaint.latitude - lat) * (Complaint.latitude - lat)
            + (Complaint.longitude - lon) * (Complaint.longitude - lon)
        )

        query = query.order_by(distance_expr, Complaint.created_at.desc())

    else:
        
        query = query.order_by(Complaint.created_at.desc())

    return query.all()