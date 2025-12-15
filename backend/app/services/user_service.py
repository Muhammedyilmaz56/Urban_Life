from datetime import datetime, timedelta
import random
from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models.user_model import User

from app.utils.email_service import send_email_change_code
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _hash_code(code: str) -> str:
    return pwd_context.hash(code)


def _verify_code(code: str, hashed: str) -> bool:
    return pwd_context.verify(code, hashed)


def request_email_change(db: Session, user: User, new_email: str):
    new_email = new_email.lower().strip()

   
    exists = db.query(User).filter(User.email == new_email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kullanılıyor.")

    code = str(random.randint(100000, 999999))

    user.email_change_pending = new_email
    user.email_change_code_hash = _hash_code(code)
    user.email_change_expires = datetime.utcnow() + timedelta(minutes=10)

    db.commit()

    send_email_change_code(new_email, code)



def confirm_email_change(db: Session, user: User, code: str):
    if not user.email_change_pending:
        raise HTTPException(status_code=400, detail="Bekleyen e-posta değişikliği yok.")

    if not user.email_change_expires or user.email_change_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Doğrulama kodu süresi dolmuş.")

    if not _verify_code(code, user.email_change_code_hash):
        raise HTTPException(status_code=400, detail="Doğrulama kodu hatalı.")

    user.email = user.email_change_pending
    user.is_verified = True  
    user.email_change_pending = None
    user.email_change_code_hash = None
    user.email_change_expires = None

    db.commit()
