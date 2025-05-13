from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.user import User

class Follow(Base):
    __tablename__ = "follows"

    follow_ID = Column(Integer, primary_key=True, index=True)
    follower_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)
    following_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)
    created_At = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    follower = relationship("User", foreign_keys=[follower_ID], backref="following")
    following = relationship("User", foreign_keys=[following_ID], backref="followers")
