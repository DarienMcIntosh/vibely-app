from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.sql import func
from app.database import Base

class MediaAsset(Base):
    __tablename__ = "mediaassets"
    
    asset_ID = Column(Integer, primary_key=True, index=True)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="SET NULL"), nullable=True)
    asset_Type = Column(String(30), nullable=False)
    cdn_URL = Column(String(255), nullable=False)
    original_Filename = Column(String(255))
    file_Size = Column(Integer)
    upload_Timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default="active")
    file_metadata = Column(JSON)