from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.utils.db import get_db
from app.routes.auth_routes import get_current_user, role_required
from app.models.user_model import User, UserRole

from app.schemas.admin_schema import (
    OfficialCreate, OfficialUpdate, OfficialOut,
    AdminUserOut, StatsOverviewOut, AuditLogOut
)
from app.services import admin_service
from app.schemas.admin_schema import AdminStatsOut
router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/officials", response_model=List[OfficialOut], dependencies=[Depends(role_required(UserRole.admin))])
def admin_list_officials(
    q: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    return admin_service.list_officials(db, q, is_active)

@router.post("/officials", response_model=OfficialOut, dependencies=[Depends(role_required(UserRole.admin))])
def admin_create_official(
    payload: OfficialCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return admin_service.create_official(db, user, payload.full_name, payload.email, payload.password, payload.phone_number)

@router.get("/officials/{official_id}", response_model=OfficialOut, dependencies=[Depends(role_required(UserRole.admin))])
def admin_get_official(official_id: int, db: Session = Depends(get_db)):
    return admin_service.get_official(db, official_id)

@router.put("/officials/{official_id}", response_model=OfficialOut, dependencies=[Depends(role_required(UserRole.admin))])
def admin_update_official(
    official_id: int,
    payload: OfficialUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return admin_service.update_official(db, user, official_id, payload.full_name, payload.phone_number, payload.is_active)

@router.get("/users", response_model=List[AdminUserOut], dependencies=[Depends(role_required(UserRole.admin))])
def admin_list_users(
    q: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    return admin_service.list_users(db, q, role, is_active)

@router.get("/stats/overview", response_model=StatsOverviewOut, dependencies=[Depends(role_required(UserRole.admin))])
def admin_stats_overview(db: Session = Depends(get_db)):
    return admin_service.stats_overview(db)

@router.get("/audit", response_model=List[AuditLogOut], dependencies=[Depends(role_required(UserRole.admin))])
def admin_audit(limit: int = 100, db: Session = Depends(get_db)):
    return admin_service.list_audit_logs(db, limit=limit)


@router.get("/stats", response_model=AdminStatsOut, dependencies=[Depends(role_required(UserRole.admin))])
def admin_stats(db: Session = Depends(get_db)):
    return admin_service.get_admin_stats(db)