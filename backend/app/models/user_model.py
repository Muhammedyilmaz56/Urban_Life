from sqlalchemy import Column, Integer, String, Enum, DateTime, Boolean,Date
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
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String, nullable=True)
    reset_password_token = Column(String, nullable=True)
    reset_password_expires = Column(DateTime, nullable=True)
    email_change_pending = Column(String, nullable=True)          
    email_change_code_hash = Column(String, nullable=True)        
    email_change_expires = Column(DateTime, nullable=True)       

  
    tc_kimlik_no = Column(String(11), unique=True, nullable=True)
    birth_date = Column(Date, nullable=True)
    phone_number = Column(String, nullable=True)

    is_name_public = Column(Boolean, default=True, nullable=False)
    avatar_url = Column(String, nullable=True)

    profile_completed = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
    is_phone_verified = Column(Boolean, default=False, nullable=False)
    phone_verification_code = Column(String(6), nullable=True)
    phone_verification_expires = Column(DateTime, nullable=True)
    @property
    def full_name(self):
        return self.name