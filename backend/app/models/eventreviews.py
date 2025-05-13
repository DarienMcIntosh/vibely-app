from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP, CheckConstraint
from sqlalchemy.sql import func
from app.database import Base

class EventReview(Base):
    __tablename__ = "eventreviews"

    review_ID = Column(Integer, primary_key=True, index=True)
    event_ID = Column(Integer, ForeignKey("events.event_ID", ondelete="CASCADE"), nullable=False)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=True)  # 1 to 5
    created_At = Column(TIMESTAMP, server_default=func.now())
    review_Notes = Column(Text)

    __table_args__ = (
        CheckConstraint('rating BETWEEN 1 AND 5', name='eventreviews_chk_1'),
    )
