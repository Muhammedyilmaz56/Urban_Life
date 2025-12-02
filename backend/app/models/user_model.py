from sqlalchemy import Column, Integer, String, Enum, DateTime
from datetime import datetime
import enum

from .base import Base


class UserRole(enum.Enum):
    citizen = "citizen"
    official = "official"
    employee = "employee"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.citizen, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
