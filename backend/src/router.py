from fastapi import APIRouter
from src.init import imei_client, cmc_client


router = APIRouter(
    prefix='/cryptocurrencies',
)

@router.get("")
async def get_cryptocurrencies():
    return await cmc_client.get_listings()


@router.get("/{currency_id}")
async def get_cryptocurrency(currency_id: int):
    return await cmc_client.get_currency(currency_id)


router2 = APIRouter(
    prefix='/imei',
)

@router2.post("/{imei}")
async def get_imei_info(imei: str):
    return await imei_client.get_imei_info(imei)
