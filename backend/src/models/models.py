from sqlalchemy import Column, Integer, String, Boolean, Text, LargeBinary
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    avatar = Column(LargeBinary, nullable=True)  # для хранения изображения
    avatar_type = Column(String, nullable=True)  # для хранения типа файла
    bio = Column(Text, nullable=True)  