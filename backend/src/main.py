from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.views.auth_router import auth_router
from src.views.crypto_router import router
from src.views.imei_router import router2
from src.core.init_services import cmc_client, imei_client
from src.models.user import Base
from src.models.database import engine, init_db

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
