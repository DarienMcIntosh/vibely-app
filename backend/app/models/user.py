from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    user_ID = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    first_Name = Column(String(50))
    last_Name = Column(String(50))
    email = Column(String(100), unique=True, nullable=False)
    hash_Password = Column(String(255))
    city = Column(String(100))
    country = Column(String(100))
    user_Type = Column(String(20), default='standard')
    account_Status = Column(String(20), default='active')
    date_Created = Column(DateTime(timezone=True), server_default=func.now())
    last_Login = Column(DateTime(timezone=True), onupdate=func.now())
    auth_provider = Column(String(50))

    organizer = relationship("Organizer", back_populates="user", uselist=False)
    interactions = relationship("EventInteraction", back_populates="user", cascade="all, delete-orphan")
