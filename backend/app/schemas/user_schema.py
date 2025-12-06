from pydantic import BaseModel, EmailStr, validator
from typing import Optional
import enum


class UserRole(str, enum.Enum):
    citizen = "citizen"
    official = "official"
    employee = "employee"
    admin = "admin"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str 


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    tc_kimlik_no: Optional[str] = None
    birth_year: Optional[int] = None
    phone_number: Optional[str] = None
    is_name_public: bool
    avatar_url: Optional[str] = None
    profile_completed: bool

    class Config:
        orm_mode = True   


class UserProfileUpdate(BaseModel):
    tc_kimlik_no: Optional[str] = None
    birth_year: Optional[int] = None
    phone_number: Optional[str] = None
    is_name_public: Optional[bool] = True
    avatar_url: Optional[str] = None

    @validator("tc_kimlik_no")
    def validate_tc(cls, v):
        if v is None:
            return v
        if not (len(v) == 11 and v.isdigit()):
            raise ValueError("TC Kimlik No 11 haneli ve sadece rakamlardan oluşmalıdır.")
        return v

    @validator("birth_year")
    def validate_birth_year(cls, v):
        if v is None:
            return v
        if v < 1900 or v > 2100:
            raise ValueError("Doğum yılı geçerli bir aralıkta olmalıdır.")
        return v

    @validator("phone_number")
    def validate_phone(cls, v):
        if v is None:
            return v
        if len(v.strip()) < 7:
            raise ValueError("Telefon numarası çok kısa.")
        return v
