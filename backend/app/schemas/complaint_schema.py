from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum



class ComplaintStatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"



class ComplaintBase(BaseModel):
    title: str = Field(..., example="Sokak lambası yanmıyor")
    description: str = Field(..., example="Mahallemizdeki sokak lambası birkaç gündür çalışmıyor.")
    category_id: int = Field(..., example=1)

    latitude: Optional[float] = Field(None, example=41.0082)
    longitude: Optional[float] = Field(None, example=28.9784)

    is_anonymous: bool = Field(False, example=False)

    photo_url: Optional[str] = Field(None, example="http://example.com/photo.jpg")



class ComplaintCreate(ComplaintBase):
    pass



class ComplaintUpdate(BaseModel):
    status: Optional[str] = Field(None, example="in_progress")
    priority: Optional[str] = Field(None, example="high")
    category_id: Optional[int] = None



class ComplaintRatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, example=4)
    comment: Optional[str] = Field(None, example="Teşekkürler")


class ComplaintRatingOut(BaseModel):
    id: int
    complaint_id: int
    user_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True



class ComplaintSupportCreate(BaseModel):
    pass


class ComplaintSupportOut(BaseModel):
    id: int
    complaint_id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True



class ComplaintUpdateStatus(BaseModel):
    status: ComplaintStatusEnum


class ComplaintPhotoOut(BaseModel):
    id: int
    photo_url: str
    created_at: datetime

    class Config:
        orm_mode = True



class ComplaintOut(BaseModel):
    id: int
    user_id: int

    title: Optional[str]
    description: str
    category_id: Optional[int]

    status: str
    priority: str

    latitude: Optional[float]
    longitude: Optional[float]

    photo_url: Optional[str]

    is_anonymous: bool
    support_count: int

    created_at: datetime
    updated_at: datetime

    photos: Optional[List[ComplaintPhotoOut]] = []

    class Config:
        orm_mode = True
