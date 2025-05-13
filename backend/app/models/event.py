from sqlalchemy import Column, Integer, String, Text, Date, Time, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Event(Base):
    __tablename__ = "events"

    event_ID = Column(Integer, primary_key=True, index=True)
    organizer_ID = Column(Integer, ForeignKey("organizers.organizer_ID", ondelete="CASCADE"))
    event_Type = Column(String(50), nullable=False)
    event_Name = Column(String(100), nullable=False)
    event_Location = Column(String(255))
    event_Category = Column(String(50))
    celebrity = Column(String(100))
    event_Date = Column(Date, nullable=False)
    start_Time = Column(Time, nullable=False)
    end_Time = Column(Time)
    event_Description = Column(Text)
    is_Free = Column(Boolean, default=False)
    is_Paid = Column(Boolean, default=True)
    max_Capacity = Column(Integer)
    created_At = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    event_Status = Column(String(20), default="upcoming")
    is_Recurring = Column(Boolean, default=False)
    interactions = relationship("EventInteraction", back_populates="event", cascade="all, delete-orphan")
