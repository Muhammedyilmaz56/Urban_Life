from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from typing import Dict
class OfficialCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None

class OfficialUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None

class OfficialOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AdminUserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class StatsOverviewOut(BaseModel):
    total: int
    open: int
    in_progress: int
    resolved: int

class AuditLogOut(BaseModel):
    id: int
    actor_user_id: Optional[int] = None
    action: str
    target_type: Optional[str] = None
    target_id: Optional[int] = None
    detail: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AdminStatsOut(BaseModel):
    total_users: int
    users_by_role: Dict[str, int]
    total_complaints: int
    complaints_by_status: Dict[str, int]
    complaints_last_7_days: int