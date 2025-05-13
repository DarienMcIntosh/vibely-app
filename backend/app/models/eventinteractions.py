from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class EventInteraction(Base):
    __tablename__ = "eventinteractions"

    interaction_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_ID"))
    event_id = Column(Integer, ForeignKey("events.event_ID"))  # Fixed line
    rsvp = Column(Boolean, default=False)
    saved = Column(Boolean, default=False)
    clicked = Column(Boolean, default=False)
    interaction_date = Column(DateTime(timezone=True), default=func.now())

    user = relationship("User", back_populates="interactions")
    event = relationship("Event", back_populates="interactions")
