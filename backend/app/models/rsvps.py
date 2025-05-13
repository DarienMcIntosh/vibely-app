from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class RSVP(Base):
    __tablename__ = "rsvps"

    rsvp_ID = Column(Integer, primary_key=True, index=True)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)
    event_ID = Column(Integer, ForeignKey("events.event_ID", ondelete="CASCADE"), nullable=False)
    rsvp_Status = Column(String(20), nullable=False)  # e.g. confirmed, pending, cancelled
    created_At = Column(TIMESTAMP, server_default=func.now())
    updated_At = Column(TIMESTAMP, onupdate=func.now())
    note = Column(Text, nullable=True)
    guest_Count = Column(Integer, default=1)
