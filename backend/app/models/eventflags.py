from sqlalchemy import Column, Integer, Text, ForeignKey, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class EventFlag(Base):
    __tablename__ = "eventflags"

    flag_ID = Column(Integer, primary_key=True, index=True)
    event_ID = Column(Integer, ForeignKey("events.event_ID", ondelete="CASCADE"), nullable=False)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(Enum("pending", "resolved", "rejected"), default="pending", nullable=False)
    created_At = Column(TIMESTAMP, server_default=func.now(), nullable=False)
