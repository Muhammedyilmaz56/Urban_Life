from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from .base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_user_id = Column(Integer, ForeignKey("users.id"), nullable=True) 
    action = Column(String, nullable=False)  
    target_type = Column(String, nullable=True) 
    target_id = Column(Integer, nullable=True)
    detail = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
