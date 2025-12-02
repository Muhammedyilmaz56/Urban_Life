from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.auth_service import register_user, login_user
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.models.user_model import User, UserRole
from app.utils.db import get_db
from app.utils.security import decode_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = HTTPBearer()


# Kullanıcıyı token’dan çözümle
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


# Rol kontrolü (örn: sadece admin, ya da admin+official gibi)
def role_required(required_roles: list[UserRole]):
    def wrapper(current_user: User = Depends(get_current_user)):
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu işlem için yetkiniz yok"
            )
        return current_user
    return wrapper


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
                "role": new_user.role.value if hasattr(new_user.role, "value") else new_user.role
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
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# Sadece adminler
@router.get("/admin-only")
def admin_endpoint(current_user: User = Depends(role_required([UserRole.admin]))):
    return {"message": f"Hoş geldin {current_user.name}, sen adminsin!"}


# Admin + official erişebilir
@router.get("/dashboard")
def dashboard(current_user: User = Depends(role_required([UserRole.admin, UserRole.official]))):
    return {"message": f"{current_user.role.value} paneline eriştin"}

