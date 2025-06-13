from sqlalchemy import Column, Integer, String, DateTime 
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    role_id = Column(Integer, default = 1)
    subscription_id = Column(Integer, default = 1)

# Модели для Pydantic

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserRequest(UserBase):
    id: int
    password_hash: str
    created_at: datetime
    role_id: int
    subscription_id: int

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str
    remember: bool

    class Config:
        from_attributes = True

