from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
import secrets
from typing import Iterable, Union
from app.services.auth_service import register_user, login_user
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.models.user_model import User, UserRole
from app.utils.db import get_db
from app.utils.security import decode_access_token, hash_password
from app.utils.email_service import send_password_reset_email

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = HTTPBearer()




class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str




def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
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



def role_required(required_roles: Union[UserRole, Iterable[UserRole]]):
   
    if isinstance(required_roles, UserRole):
        required_roles = [required_roles]
    else:
        required_roles = list(required_roles)

    def wrapper(current_user=Depends(get_current_user)):
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu işlem için yetkiniz yok."
            )
        return current_user

    return wrapper



@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Yeni kullanıcı kaydı:
    - is_verified = False
    - verification_token oluşturulup email ile gönderilir
    """
    from fastapi import HTTPException as FastAPIHTTPException

    try:
        new_user = register_user(db, user)
        return {
            "message": "Kayıt başarılı. Lütfen emailinizi kontrol ederek hesabınızı doğrulayın.",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "role": new_user.role.value if hasattr(new_user.role, "value") else new_user.role
            }
        }
    except FastAPIHTTPException as e:

        raise e
    except Exception as e:
        print("REGISTER ERROR:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Server Error: {str(e)}"
        )




@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    """
    - Email + şifre doğrulama
    - is_verified = True değilse login'e izin vermez
    """
    return login_user(db, user)




@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Kullanıcının mevcut şifresini doğrulayıp yeni şifreyle değiştirir.
    """
    from app.utils.security import verify_password
    
    # Mevcut şifreyi doğrula
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mevcut şifre yanlış."
        )
    
    # Yeni şifre en az 6 karakter olmalı
    if len(payload.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Yeni şifre en az 6 karakter olmalıdır."
        )
    
    # Yeni şifreyi hashle ve kaydet
    current_user.password_hash = hash_password(payload.new_password)
    current_user.updated_at = datetime.utcnow()
    db.add(current_user)
    db.commit()
    
    return {"message": "Şifre başarıyla değiştirildi."}


@router.get("/admin-only")
def admin_endpoint(current_user: User = Depends(role_required([UserRole.admin]))):
    return {"message": f"Hoş geldin {current_user.name}, sen adminsin!"}


@router.get("/dashboard")
def dashboard(current_user: User = Depends(role_required([UserRole.admin, UserRole.official]))):
    return {"message": f"{current_user.role.value} paneline eriştin"}




@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    """
    Kullanıcı maildeki linke tıkladığında:
    /auth/verify-email?token=xxxx

    - verification_token eşleşen user bulunur
    - is_verified = True yapılır
    - verification_token = NULL yapılır
    """
    user = db.query(User).filter(User.verification_token == token).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Geçersiz veya süresi dolmuş doğrulama bağlantısı."
        )

    if user.is_verified:
        return {"message": "Email zaten doğrulanmış."}

    user.is_verified = True
    user.verification_token = None
    db.commit()

    return {"message": "E-posta başarıyla doğrulandı. Artık giriş yapabilirsiniz."}




@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    - Kullanıcı emailini gönderir
    - Eğer sistemde varsa reset_password_token + expires set edilir
    - Şifre sıfırlama maili gönderilir
    - Güvenlik için kullanıcı yoksa da aynı mesaj döndürülür
    """
    user = db.query(User).filter(User.email == payload.email).first()


    if not user:
        return {
            "message": "Eğer bu e-posta sistemde kayıtlıysa, şifre sıfırlama maili gönderildi."
        }

    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)

    user.reset_password_token = token
    user.reset_password_expires = expires_at
    db.add(user)
    db.commit()

    send_password_reset_email(user.email, token)

    return {
        "message": "Eğer bu e-posta sistemde kayıtlıysa, şifre sıfırlama maili gönderildi."
    }



@router.get("/reset-password")
def reset_password_info(token: str):
    """
    Tarayıcıda maildeki HTTP linke tıklanırsa bilgilendirici mesaj döner.
    Asıl şifre sıfırlama işlemi POST /auth/reset-password ile yapılır.
    """
    return {
        "message": "Bu bağlantı API içindir. Mobil uygulamada 'Şifre Sıfırla' ekranına gidip bu token değerini kullanabilirsiniz.",
        "token": token,
    }




@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    - Maildeki token ile gelir: token + new_password
    - Token geçerli mi ve süresi dolmamış mı kontrol edilir
    - password_hash güncellenir, tokenlar sıfırlanır
    """
    user = db.query(User).filter(User.reset_password_token == payload.token).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Geçersiz veya kullanılmış şifre sıfırlama bağlantısı."
        )

    if not user.reset_password_expires or user.reset_password_expires < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Şifre sıfırlama bağlantısının süresi dolmuş."
        )

    user.password_hash = hash_password(payload.new_password)

    user.reset_password_token = None
    user.reset_password_expires = None

    db.add(user)
    db.commit()

    return {"message": "Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz."}
