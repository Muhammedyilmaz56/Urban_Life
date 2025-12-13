from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.utils.db import get_db
from app.routes.auth_routes import get_current_user, role_required
from app.models.user_model import User, UserRole
from app.schemas.worker_schema import WorkerCreate, WorkerUpdate, WorkerOut
from app.services.worker_service import (
    create_worker,
    get_workers,
    update_worker,
    delete_worker
)

router = APIRouter(
    prefix="/workers",
    tags=["Workers"]
)

@router.post("/", response_model=WorkerOut)
def create(
    data: WorkerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.official))

):
    return create_worker(db, data)

@router.get("/", response_model=List[WorkerOut])
def list_workers(
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_workers(db, category_id)

@router.put("/{worker_id}", response_model=WorkerOut)
def update(
    worker_id: int,
    data: WorkerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.official))
):
    return update_worker(db, worker_id, data)

@router.delete("/{worker_id}", status_code=204)
def delete(
    worker_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.official))
):
    delete_worker(db, worker_id)
    return None