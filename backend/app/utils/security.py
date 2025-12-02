from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Config
SECRET_KEY = os.getenv("SECRET_KEY", "urbanlife_secret_key")  # Development için default
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# Bcrypt ayarları
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# 🔑 Şifre hashleme
def hash_password(password: str) -> str:
    # bcrypt sadece 72 byte destekler, kontrol ekliyoruz
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Şifre en fazla 72 karakter olabilir"
        )
    return pwd_context.hash(password)


# 🔑 Şifre doğrulama
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# 🔑 Token oluşturma
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# 🔑 Token çözme
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz veya süresi dolmuş token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
