from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.utils.db import get_db
from app.models.user_model import User, UserRole
from app.models.complaint_model import Complaint
from app.schemas.complaint_schema import ComplaintOut
from app.routes.auth_routes import get_current_user, role_required

router = APIRouter(
    prefix="/official",
    tags=["Official / Manager"],
)


@router.get("/complaints", response_model=List[ComplaintOut])
def list_complaints_for_manager(
    status: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.official, UserRole.admin])),
):
    """
    Belediye yöneticisinin (official rolünün) tüm şikayetleri listelemesi.
    """
    query = db.query(Complaint)

    if status:
        query = query.filter(Complaint.status == status)

    if category_id:
        query = query.filter(Complaint.category_id == category_id)

    complaints = query.order_by(Complaint.created_at.desc()).all()
    return complaints
