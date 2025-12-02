from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from app.services.auth_service import register_user, login_user
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.models.user_model import User
from app.utils.db import get_db
from app.utils.security import decode_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Kayıt ol
@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        new_user = register_user(db, user)
        return {
            "message": "Kayıt başarılı",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "role": new_user.role
            }
        }
    except Exception as e:
        print("REGISTER ERROR:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Server Error: {str(e)}"
        )


# Giriş yap
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, user)


# Me - giriş yapan kullanıcı bilgisi
@router.get("/me", response_model=UserResponse)
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user_id = int(payload.get("sub"))
    db_user = db.query(User).filter_by(id=user_id).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return db_user
