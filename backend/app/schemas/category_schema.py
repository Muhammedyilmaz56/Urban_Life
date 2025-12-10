# app/schemas/category_schema.py

from pydantic import BaseModel
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: Optional[bool] = True


class CategoryCreate(CategoryBase):
    """
    Kategori oluşturmak için kullanılacak şema.
    """
    pass


class CategoryUpdate(BaseModel):
    """
    Kategori güncellemek için kullanılacak şema.
    Tüm alanlar opsiyonel, sadece değişenler gönderilir.
    """
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryOut(CategoryBase):
    """
    Response olarak dönecek kategori şeması.
    """
    id: int

    class Config:
        orm_mode = True
