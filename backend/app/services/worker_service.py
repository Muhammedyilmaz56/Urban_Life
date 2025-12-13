from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.worker import Worker
from app.models.category_model import Category
from app.schemas.worker_schema import WorkerCreate, WorkerUpdate
from app.models.user_model import User, UserRole
from app.utils.security import hash_password  

def create_worker(db: Session, data: WorkerCreate):
  
    category = db.query(Category).filter(Category.id == data.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kategori bulunamadı")

    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bu email zaten kayıtlı")

  
    user = User(
        name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=UserRole.employee,
        is_verified=True,          
        profile_completed=True,    
    )
    db.add(user)
    db.flush() 

    
    worker = Worker(
        full_name=data.full_name,
        phone=data.phone,
        email=data.email,
        category_id=data.category_id,
        user_id=user.id,
        is_active=True,
    )
    db.add(worker)

    db.commit()
    db.refresh(worker)
    return worker


def get_workers(db: Session, category_id: int | None = None):
    q = db.query(Worker)
    if category_id is not None:
        q = q.filter(Worker.category_id == category_id)
    return q.order_by(Worker.id.desc()).all()

def update_worker(db: Session, worker_id: int, data: WorkerUpdate):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="İşçi bulunamadı")

    payload = data.dict(exclude_unset=True)

    
    if "category_id" in payload and payload["category_id"] is not None:
        category = db.query(Category).filter(Category.id == payload["category_id"]).first()
        if not category:
            raise HTTPException(status_code=404, detail="Kategori bulunamadı")

    for key, value in payload.items():
        setattr(worker, key, value)

    db.commit()
    db.refresh(worker)
    return worker

def delete_worker(db: Session, worker_id: int):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="İşçi bulunamadı"
        )
    db.delete(worker)
    db.commit()
