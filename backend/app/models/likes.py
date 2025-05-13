from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from app.database import Base

class Like(Base):
    __tablename__ = "likes"

    like_ID = Column(Integer, primary_key=True, index=True)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)
    entity_ID = Column(Integer, nullable=False)
    entity_Type = Column(String(50), nullable=False)  # e.g., "event"
    created_At = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        # Enforce one like per entity per user
        {'mysql_engine': 'InnoDB'}
    )
