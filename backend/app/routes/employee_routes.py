from fastapi import APIRouter, Depends,HTTPException,UploadFile, File
from sqlalchemy.orm import Session
from app.models.assignment_model import Assignment, AssignmentStatus
from datetime import datetime
from app.utils.db import get_db
from app.routes.auth_routes import get_current_user, role_required
from app.models.user_model import UserRole, User
from app.services import employee_service
from typing import List

from pathlib import Path
import time, json


from app.models.complaint_model import Complaint, ComplaintStatus

router = APIRouter(prefix="/employee", tags=["Employee"])
SOLUTION_DIR = Path("media/solutions")
SOLUTION_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/assignments/{assignment_id}/solution-photos")
async def upload_solution_photos(
    assignment_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.employee)),
):
    assignment = (
        db.query(Assignment)
        .filter(Assignment.id == assignment_id, Assignment.employee_id == current_user.id)
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")

    saved_paths: List[str] = []

    for f in files:
        timestamp = int(time.time())
        safe_name = f"solution_{assignment_id}_{timestamp}_{f.filename}"
        file_path = SOLUTION_DIR / safe_name

        content = await f.read()
        with open(file_path, "wb") as out:
            out.write(content)

        public_path = f"/media/solutions/{safe_name}"
        saved_paths.append(public_path)


    prev: List[str] = []
    if assignment.solution_photo_url:
        try:
            prev = json.loads(assignment.solution_photo_url) or []
            if not isinstance(prev, list):
                prev = []
        except Exception:
            prev = []

    merged = prev + saved_paths
    assignment.solution_photo_url = json.dumps(merged, ensure_ascii=False)

    assignment.status = AssignmentStatus.completed
    assignment.end_time = assignment.end_time or datetime.utcnow()

    complaint = db.query(Complaint).filter(Complaint.id == assignment.complaint_id).first()
    if complaint:
        complaint.status = ComplaintStatus.resolved

    db.commit()
    return {"solution_photo_urls": merged, "assignment_status": "completed"}
@router.get("/complaints/assigned")
def get_assigned_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.employee)),
):
    return employee_service.get_assigned_complaints(db, current_user.id)
@router.post("/assignments/{assignment_id}/start")
def start_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.employee)),
):
    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.employee_id == current_user.id
        )
        .first()
    )

    if not assignment:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")

    assignment.status = AssignmentStatus.in_progress
    assignment.start_time = datetime.utcnow()

    db.commit()
    return {"status": "started"}

@router.post("/assignments/{assignment_id}/complete")
def complete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.employee)),
):
    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.employee_id == current_user.id
        )
        .first()
    )

    if not assignment:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")

    assignment.status = AssignmentStatus.completed
    assignment.end_time = datetime.utcnow()

    db.commit()
    return {"status": "completed"}
@router.get("/complaints/completed")
def get_completed_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.employee)),
):
    return employee_service.get_completed_complaints(db, current_user.id)

@router.get("/assignments/{assignment_id}")
def get_assignment_detail(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(UserRole.employee)),
):
    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.employee_id == current_user.id
        )
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=404, detail="Görev bulunamadı")

    complaint = db.query(Complaint).filter(Complaint.id == assignment.complaint_id).first()

    return {
        "assignment_id": assignment.id,
        "assignment_status": assignment.status.value,
        "solution_photo_url": assignment.solution_photo_url,
        "complaint": complaint,
    }
