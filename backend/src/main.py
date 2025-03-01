from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.views.auth_router import auth_router
from src.views.crypto_router import router
from src.views.imei_router import router2
from src.controller.init import imei_client, cmc_client
from src.models.models import Base
from src.models.database import engine, init_db
from sqlalchemy import inspect

# Инициализируем базу данных
init_db()

# Проверяем существование таблиц и создаем только отсутствующие
inspector = inspect(engine)
existing_tables = inspector.get_table_names()

# Создаем только те таблицы, которых еще нет
for table in Base.metadata.tables.values():
    if table.name not in existing_tables:
        table.create(engine)

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
