from sqlalchemy import Column, Integer, String, Date, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class RecurringEventPattern(Base):
    __tablename__ = "recurringeventpatterns"

    pattern_ID = Column(Integer, primary_key=True, index=True)
    event_ID = Column(Integer, ForeignKey("events.event_ID", ondelete="CASCADE"), nullable=False)
    frequency = Column(String(20), nullable=False)  # e.g., daily, weekly, monthly
    repeat_Interval = Column(Integer, default=1)
    days_Of_Week = Column(String(20), nullable=True)  # comma-separated like "Mon,Wed"
    day_Of_Month = Column(Integer, nullable=True)
    month_Of_Year = Column(Integer, nullable=True)
    start_Date = Column(Date, nullable=False)
    end_Date = Column(Date, nullable=True)
    max_Occurrences = Column(Integer, nullable=True)
    created_At = Column(TIMESTAMP, server_default=func.now())

    occurrences = relationship("EventOccurrence", back_populates="pattern")
