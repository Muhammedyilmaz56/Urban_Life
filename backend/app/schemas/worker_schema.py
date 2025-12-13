from pydantic import BaseModel, EmailStr
from typing import Optional


class WorkerCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: EmailStr
    password: str  
    category_id: int


class WorkerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None


class WorkerOut(BaseModel):
    id: int
    full_name: str
    phone: Optional[str]
    email: Optional[str]
    category_id: int
    is_active: bool

    user_id: int  

    class Config:
        from_attributes = True
