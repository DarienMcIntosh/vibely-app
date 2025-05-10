from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from app.database import Base

class SavedItem(Base):
    __tablename__ = "saveditems"

    saved_Item_ID = Column(Integer, primary_key=True)
    user_ID = Column(Integer, ForeignKey("users.user_ID", ondelete="CASCADE"))
    entity_ID = Column(Integer)
    entity_Type = Column(String(50))
    created_At = Column(TIMESTAMP)
    collection_Name = Column(String(100), default="Default")
