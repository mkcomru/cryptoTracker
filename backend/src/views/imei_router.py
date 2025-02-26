from fastapi import APIRouter
from src.controller.imei_http_client import imei_client


router2 = APIRouter(
    prefix='/imei',
)

@router2.post("/{imei}")
async def get_imei_info(imei: str):
    return await imei_client.get_imei_info(imei)