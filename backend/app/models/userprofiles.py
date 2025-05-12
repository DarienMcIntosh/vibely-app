from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.dialects.mysql import JSON
from app.database import Base

class UserProfile(Base):
    __tablename__ = "userprofiles"
    
    profile_ID = Column(Integer, primary_key=True, index=True)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"), nullable=False)
    profile_PictureID = Column(Integer, ForeignKey("mediaassets.asset_ID", ondelete="SET NULL"), nullable=True)
    display_Name = Column(String(100))
    bio = Column(Text)
    preferences = Column(JSON)