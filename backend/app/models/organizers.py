from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Organizer(Base):
    __tablename__ = "organizers"

    organizer_ID = Column(Integer, primary_key=True, index=True)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)

    verification_Status = Column(String(20), default="pending")
    verification_Date = Column(TIMESTAMP)
    verification_DocumentURL = Column(String(255))

    company_Name = Column(String(100), nullable=True)
    business_Description = Column(Text, nullable=True)

    #country = Column(String(100))
    #city = Column(String(100))
    event_Types = Column(JSON, nullable=True)

    #trust_Score = Column(Integer, default=50)
    created_At = Column(TIMESTAMP, server_default=func.now())

    # Relationship to User (if needed)
    user = relationship("User", back_populates="organizer")
