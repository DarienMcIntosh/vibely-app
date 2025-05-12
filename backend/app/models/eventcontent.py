from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from app.database import Base

class EventContent(Base):
    __tablename__ = "eventcontent"

    content_ID = Column(Integer, primary_key=True, index=True)
    event_ID = Column(Integer, ForeignKey("events.event_ID", ondelete="CASCADE"))
    asset_ID = Column(Integer, ForeignKey("mediaassets.asset_ID", ondelete="CASCADE"))
    content_Type = Column(String(50), nullable=False)  # "image", "video", etc.
    uploaded_By = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"))
    uploaded_Timestamp = Column(TIMESTAMP)
    description = Column(Text)
    visibility = Column(String(20), default="public")
