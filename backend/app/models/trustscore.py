from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Text
from app.database import Base
from sqlalchemy.sql import func

class TrustScore(Base):
    __tablename__ = "trust_scores"

    score_ID = Column(Integer, primary_key=True, index=True)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, default=50)
    reason = Column(Text)
    created_At = Column(TIMESTAMP, server_default=func.now())
