from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.category_model import Category

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("")
def list_categories(db: Session = Depends(get_db)):
    items = db.query(Category).order_by(Category.id.asc()).all()
    return [{"id": c.id, "name": c.name} for c in items]
