from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .base import Base


class NotificationStatus(enum.Enum):
    sent = "sent"
    delivered = "delivered"
    read = "read"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(Enum(NotificationStatus), default=NotificationStatus.sent, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # İlişki
    user = relationship("User", backref="notifications")
