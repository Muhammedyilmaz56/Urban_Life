from sqlalchemy.orm import Session
from app.models.complaint_model import Complaint, ComplaintStatus, Priority
from app.models.complaint_rating_model import ComplaintRating
from app.models.complaint_support_model import ComplaintSupport
from app.services.ai_service import predict_category
from app.models.category_model import Category
from app.models.complaint_model import Complaint, ComplaintStatus

from app.schemas.complaint_schema import (
    ComplaintCreate,
    ComplaintUpdate,
    ComplaintRatingCreate,
    ComplaintSupportCreate,
)

from datetime import datetime


# --- Complaint Services ---

def create_complaint(db: Session, user_id: int, complaint: ComplaintCreate):
    # AI ile kategori tahmini
    category_name = predict_category(complaint.description)

    # DB’de kategori var mı?
    category = db.query(Category).filter(Category.name == category_name).first()
    if not category:
        category = Category(
            name=category_name,
            description=f"{category_name} sorunları"
        )
        db.add(category)
        db.commit()
        db.refresh(category)

    # Şikayet oluştur
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


def update_complaint_status(db: Session, complaint_id: int, data: ComplaintUpdate):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        return None

    if data.status:
        complaint.status = ComplaintStatus(data.status)
    if data.priority:
        complaint.priority = Priority(data.priority)
    if data.category_id:
        complaint.category_id = data.category_id

    complaint.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(complaint)
    return complaint


# --- Rating Services ---

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


# --- Support Services ---

def add_support(db: Session, complaint_id: int, user_id: int):
    # Daha önce destek vermiş mi kontrol edelim
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
# --- Status Update Service for Officials/Employees ---
def update_complaint_status(db: Session, complaint_id: int, new_status: str):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        return None
    
    complaint.status = ComplaintStatus(new_status)
    db.commit()
    db.refresh(complaint)
    return complaint