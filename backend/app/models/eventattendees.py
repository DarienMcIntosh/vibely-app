from sqlalchemy import Column, Integer, ForeignKey, String, TIMESTAMP
from app.database import Base

class EventAttendee(Base):
    __tablename__ = "eventattendees"

    registration_ID = Column(Integer, primary_key=True)
    event_ID = Column(Integer, ForeignKey("events.event_ID", ondelete="CASCADE"))
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"))
    registration_Time = Column(TIMESTAMP)
    status = Column(String(20), default="confirmed")
