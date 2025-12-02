from pydantic import BaseModel, EmailStr
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
    password: str  # role yok! sadece bunlar


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole

    class Config:
        from_attributes = True
