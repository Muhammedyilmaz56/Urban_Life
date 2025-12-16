from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException
from typing import Optional

from datetime import datetime, timedelta

from app.models.user_model import User, UserRole
from app.models.audit_log_model import AuditLog
from app.models.complaint_model import Complaint, ComplaintStatus
from app.utils.security import hash_password


def _audit(
    db: Session,
    actor_user_id: Optional[int],
    action: str,
    target_type: str = None,
    target_id: int = None,
    detail: str = None,
):
    log = AuditLog(
        actor_user_id=actor_user_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        detail=detail,
    )
    db.add(log)
    db.commit()


def create_official(
    db: Session,
    actor: User,
    full_name: str,
    email: str,
    password: str,
    phone_number: Optional[str],
):
    exists = db.query(User).filter(User.email == email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kullanılıyor.")

    u = User(
        name=full_name.strip(),
        email=email.lower().strip(),
        password_hash=hash_password(password),
        role=UserRole.official,
        phone_number=phone_number.strip() if phone_number else None,
        is_active=True,
        is_verified=True,
    )
    db.add(u)
    db.commit()
    db.refresh(u)

    _audit(db, actor.id, "CREATE_OFFICIAL", "user", u.id, f"official created: {u.email}")
    return u


def list_officials(db: Session, q: Optional[str], is_active: Optional[bool]):
    query = db.query(User).filter(User.role == UserRole.official)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if q:
        qq = f"%{q.lower().strip()}%"
        query = query.filter(or_(User.email.ilike(qq), User.name.ilike(qq)))
    return query.order_by(User.created_at.desc()).all()


def get_official(db: Session, official_id: int):
    u = (
        db.query(User)
        .filter(User.id == official_id, User.role == UserRole.official)
        .first()
    )
    if not u:
        raise HTTPException(status_code=404, detail="Yönetici bulunamadı.")
    return u


def update_official(
    db: Session,
    actor: User,
    official_id: int,
    full_name: Optional[str],
    phone_number: Optional[str],
    is_active: Optional[bool],
):
    u = get_official(db, official_id)

    if full_name is not None:
        u.name = full_name.strip()
    if phone_number is not None:
        u.phone_number = phone_number.strip()
    if is_active is not None:
        u.is_active = bool(is_active)

    db.commit()
    db.refresh(u)

    _audit(db, actor.id, "UPDATE_OFFICIAL", "user", u.id, f"official updated: {u.email}")
    return u


def list_users(db: Session, q: Optional[str], role: Optional[str], is_active: Optional[bool]):
    query = db.query(User)
    if role:
        query = query.filter(User.role == UserRole(role))
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if q:
        qq = f"%{q.lower().strip()}%"
        query = query.filter(or_(User.email.ilike(qq), User.name.ilike(qq)))
    return query.order_by(User.created_at.desc()).all()


def stats_overview(db: Session):
    total = db.query(Complaint).count()
    open_count = db.query(Complaint).filter(Complaint.status == ComplaintStatus.pending).count()
    in_progress = db.query(Complaint).filter(Complaint.status == ComplaintStatus.in_progress).count()
    resolved = db.query(Complaint).filter(Complaint.status == ComplaintStatus.resolved).count()

    return {
        "total": int(total),
        "open": int(open_count),
        "in_progress": int(in_progress),
        "resolved": int(resolved),
    }


def list_audit_logs(db: Session, limit: int = 100):
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()


def get_admin_stats(db: Session):
  
    total_users = db.query(User).count()
    total_complaints = db.query(Complaint).count()

   
    users_by_role = {
        "citizen": db.query(User).filter(User.role == UserRole.citizen).count(),
        "official": db.query(User).filter(User.role == UserRole.official).count(),
        "employee": db.query(User).filter(User.role == UserRole.employee).count(),
        "admin": db.query(User).filter(User.role == UserRole.admin).count(),
    }

 
    complaints_by_status = {
        "pending": db.query(Complaint).filter(Complaint.status == ComplaintStatus.pending).count(),
        "in_progress": db.query(Complaint).filter(Complaint.status == ComplaintStatus.in_progress).count(),
        "resolved": db.query(Complaint).filter(Complaint.status == ComplaintStatus.resolved).count(),
    }

   
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    complaints_last_7_days = (
        db.query(Complaint)
        .filter(Complaint.created_at >= seven_days_ago)
        .count()
    )

    return {
        "total_users": int(total_users),
        "users_by_role": {k: int(v) for k, v in users_by_role.items()},
        "total_complaints": int(total_complaints),
        "complaints_by_status": {k: int(v) for k, v in complaints_by_status.items()},
        "complaints_last_7_days": int(complaints_last_7_days),
    }
