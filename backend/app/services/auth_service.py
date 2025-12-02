from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserLogin
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)


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
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz kimlik bilgileri."
        )

    # JWT token üret
    token = create_access_token({
        "sub": str(db_user.id),
        "role": db_user.role
    })

    return {"access_token": token, "token_type": "bearer"}
