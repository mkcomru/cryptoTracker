from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    avatar = Column(Text, nullable=True, default="https://api.dicebear.com/7.x/avataaars/svg")  # URL аватара по умолчанию 
    bio = Column(Text, nullable=True, default="")  # Поле для описания пользователя 