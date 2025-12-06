

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserResponse, UserProfileUpdate
from app.routes.auth_routes import get_current_user  

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
  
    data = profile_data.dict(exclude_unset=True)

    new_tc = data.get("tc_kimlik_no")
    if new_tc:
        
        if current_user.tc_kimlik_no and current_user.tc_kimlik_no != new_tc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="TC Kimlik numaranızı değiştiremezsiniz.",
            )

        existing = (
            db.query(User)
            .filter(User.tc_kimlik_no == new_tc, User.id != current_user.id)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu TC Kimlik numarası başka bir kullanıcı tarafından kullanılıyor.",
            )

        current_user.tc_kimlik_no = new_tc

    if "birth_year" in data:
        current_user.birth_year = data["birth_year"]

    if "phone_number" in data:
        current_user.phone_number = data["phone_number"]

    if "is_name_public" in data and data["is_name_public"] is not None:
        current_user.is_name_public = data["is_name_public"]

    if "avatar_url" in data:
        current_user.avatar_url = data["avatar_url"]

    if (
        current_user.tc_kimlik_no
        and current_user.birth_year
        and current_user.phone_number
    ):
        current_user.profile_completed = True

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user
