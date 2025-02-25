from fastapi import FastAPI
from src.router import router, router2, auth_router
from fastapi.middleware.cors import CORSMiddleware
from src.init import cmc_client, imei_client
from src.models import Base
from src.database import engine, init_db

# Инициализируем базу данных
init_db()

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("shutdown")
async def shutdown_event():
    await cmc_client.close()
    await imei_client.close()

app.include_router(router)
app.include_router(router2)
app.include_router(auth_router)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
