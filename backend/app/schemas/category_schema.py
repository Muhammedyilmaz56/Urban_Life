from pydantic import BaseModel
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True  
