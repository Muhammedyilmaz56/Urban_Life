from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Union
import enum
from datetime import datetime, date


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
    full_name: Optional[str] = None
    email: EmailStr
    role: str
    tc_kimlik_no: Optional[str] = None
    birth_date: Optional[date] = None
    phone_number: Optional[str] = None
    is_name_public: bool
    avatar_url: Optional[str] = None
    profile_completed: bool

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    tc_kimlik_no: Optional[str] = None
    birth_date: Optional[Union[date, str]] = None
    is_name_public: Optional[bool] = None
    avatar_url: Optional[str] = None

    @validator("tc_kimlik_no")
    def validate_tc(cls, v):
        if v is None:
            return v
        if not (len(v) == 11 and v.isdigit()):
            raise ValueError("TC Kimlik No 11 haneli ve sadece rakamlardan oluşmalıdır.")
        return v

    @validator("phone_number")
    def validate_phone(cls, v):
        if v is None:
            return v
        if len(v.strip()) < 7:
            raise ValueError("Telefon numarası çok kısa.")
        return v
class EmailChangeRequestIn(BaseModel):
        new_email: EmailStr


class EmailChangeConfirmIn(BaseModel):
    code: str