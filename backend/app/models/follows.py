from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Follow(Base):
    __tablename__ = "follows"

    follow_ID = Column(Integer, primary_key=True, index=True)
    follower_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"))
    following_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"))
    created_At = Column(DateTime(timezone=True), server_default=func.now())
