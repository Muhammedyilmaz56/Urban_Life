from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, date  
import os

from app.utils.db import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserResponse, UserProfileUpdate
from app.routes.auth_routes import get_current_user
from app.schemas.user_schema import EmailChangeRequestIn, EmailChangeConfirmIn
from app.services.user_service import request_email_change, confirm_email_change
from pydantic import BaseModel

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)
class StartPhoneVerificationRequest(BaseModel):
    phone_number: str


class VerifyPhoneRequest(BaseModel):
    code: str
AVATAR_DIR = "media/avatars"


@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ["image/jpeg", "image/jpg", "image/png"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sadece JPG veya PNG dosyası yükleyebilirsin.",
        )

    os.makedirs(AVATAR_DIR, exist_ok=True)

    ext = ".jpg"
    if file.filename.lower().endswith(".png"):
        ext = ".png"

    filename = f"user_{current_user.id}_{int(datetime.utcnow().timestamp())}{ext}"
    filepath = os.path.join(AVATAR_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(await file.read())

    current_user.avatar_url = f"/{AVATAR_DIR}/{filename}"
    current_user.updated_at = datetime.utcnow()
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {"avatar_url": current_user.avatar_url}


@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    if profile_data.full_name is not None:
        current_user.name = profile_data.full_name.strip()

    
    if profile_data.tc_kimlik_no is not None:
        new_tc = profile_data.tc_kimlik_no
        
        if current_user.tc_kimlik_no and current_user.tc_kimlik_no != new_tc:
             
             pass 
        
       
        if current_user.tc_kimlik_no != new_tc:
            existing = (
                db.query(User)
                .filter(User.tc_kimlik_no == new_tc, User.id != current_user.id)
                .first()
            )
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Bu TC Kimlik numarası başka bir kullanıcı tarafından kullanılıyor."
                )
            current_user.tc_kimlik_no = new_tc

   
    if profile_data.birth_date is not None:
        val = profile_data.birth_date
        
       
        if isinstance(val, str) and val.strip() != "":
            try:
                current_user.birth_date = datetime.strptime(val, "%Y-%m-%d").date()
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Tarih formatı hatalı. YYYY-MM-DD olmalı."
                )
        
       
        elif isinstance(val, date):
            current_user.birth_date = val

   
    if profile_data.phone_number is not None:
        current_user.phone_number = profile_data.phone_number

    
    if profile_data.is_name_public is not None:
        current_user.is_name_public = profile_data.is_name_public

  
    if profile_data.avatar_url is not None:
        current_user.avatar_url = profile_data.avatar_url

    # Check if profile is now complete (has required fields)
    # Required fields: tc_kimlik_no, birth_date, phone_number
    if (
        current_user.tc_kimlik_no
        and current_user.birth_date
        and current_user.phone_number
    ):
        current_user.profile_completed = True

    current_user.updated_at = datetime.utcnow()
    
    db.add(current_user) 
    db.commit()          
    db.refresh(current_user) 

    return current_user
@router.post("/me/email-change/request")
def email_change_request(
    payload: EmailChangeRequestIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    request_email_change(db, user, payload.new_email)
    return {"message": "Doğrulama kodu yeni e-postaya gönderildi."}


@router.post("/me/email-change/confirm")
def email_change_confirm(
    payload: EmailChangeConfirmIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    confirm_email_change(db, user, payload.code)
    return {"message": "E-posta başarıyla güncellendi."}