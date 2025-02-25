from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from src.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # Создаем схему public если её нет
    with engine.connect() as conn:
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS public;"))
        conn.commit()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 