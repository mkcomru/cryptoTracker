from pydantic import BaseModel, EmailStr
from typing import Optional
from fastapi import UploadFile

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    bio: Optional[str] = None
    username: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    bio: Optional[str] = None
    has_avatar: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str 