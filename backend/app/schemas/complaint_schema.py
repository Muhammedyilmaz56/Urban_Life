from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# --- Complaint Schemas ---
class ComplaintBase(BaseModel):
    description: str = Field(..., example="Mahallemizdeki sokak lambası yanmıyor.")

    latitude: Optional[float] = Field(None, example=41.0082)
    longitude: Optional[float] = Field(None, example=28.9784)
    photo_url: Optional[str] = Field(None, example="http://example.com/photo.jpg")


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintUpdate(BaseModel):
    status: Optional[str] = Field(None, example="in_progress")
    priority: Optional[str] = Field(None, example="high")
    category_id: Optional[int] = None


class ComplaintOut(BaseModel):
    id: int
    user_id: int
    description: str
    category_id: Optional[int]
    status: str
    priority: str
    latitude: Optional[float]
    longitude: Optional[float]
    photo_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# --- Rating Schemas ---
class ComplaintRatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, example=4)
    comment: Optional[str] = Field(None, example="Sorun hızlı çözüldü, teşekkürler!")


class ComplaintRatingOut(BaseModel):
    id: int
    complaint_id: int
    user_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True


# --- Support Schemas ---
class ComplaintSupportCreate(BaseModel):
    pass  # sadece kullanıcı id JWT’den gelecek


class ComplaintSupportOut(BaseModel):
    id: int
    complaint_id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
class ComplaintStatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"


class ComplaintUpdateStatus(BaseModel):
    status: ComplaintStatusEnum