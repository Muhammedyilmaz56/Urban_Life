from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.models.user_model import User, UserRole
from app.utils.db import get_db
from app.utils.security import decode_access_token
from app.schemas.user_schema import UserCreate, UserLogin
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)
auth_scheme = HTTPBearer()

# Kullanıcı kayıt servisi
def register_user(db: Session, user_data: UserCreate):
    # email zaten kayıtlı mı kontrol et
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email zaten kayıtlı."
        )

    # şifreyi güvenli şekilde hashle
    hashed_password = hash_password(user_data.password)

    # yeni kullanıcı oluştur (rol = citizen otomatik atanır)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role="citizen"   # herkes için varsayılan rol
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# Kullanıcı giriş servisi
def login_user(db: Session, user: UserLogin):
    db_user = db.query(User).filter(User.email == user.email).first()

    # kullanıcı yoksa veya şifre yanlışsa
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz kimlik bilgileri."
        )

    # JWT token üret
    token = create_access_token({
        "sub": str(db_user.id),
        "role": db_user.role.value if hasattr(db_user.role, "value") else db_user.role
    })

    return {"access_token": token, "token_type": "bearer"}
def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db)
):
    credentials = token.credentials
    payload = decode_access_token(credentials)

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


# Rol kontrolü
def role_required(required_roles: list[UserRole]):
    def wrapper(current_user: User = Depends(get_current_user)):
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu işlem için yetkiniz yok"
            )
        return current_user
    return wrapper