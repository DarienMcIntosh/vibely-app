from sqlalchemy import Column, Integer, Date, Time, Text, String, ForeignKey, TIMESTAMP, Boolean
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class EventOccurrence(Base):
    __tablename__ = "eventoccurrences"

    occurrence_ID = Column(Integer, primary_key=True, index=True)
    event_ID = Column(Integer, ForeignKey("events.event_ID", ondelete="CASCADE"), nullable=False)
    pattern_ID = Column(Integer, ForeignKey("recurringeventpatterns.pattern_ID", ondelete="CASCADE"), nullable=False)
    occurrence_Date = Column(Date, nullable=False)
    start_Time = Column(Time, nullable=False)
    end_Time = Column(Time, nullable=True)
    is_Cancelled = Column(Boolean, default=False)
    is_Modified = Column(Boolean, default=False)
    modified_Name = Column(String(100), nullable=True)
    modified_Location = Column(String(255), nullable=True)
    modified_Description = Column(Text, nullable=True)
    created_At = Column(TIMESTAMP, server_default=func.now())

    pattern = relationship("RecurringEventPattern", back_populates="occurrences")
