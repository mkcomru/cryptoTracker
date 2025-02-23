from src.http_client import CMCHTTPClient, IMEIHTTPClient
from src.config import settings


cmc_client = CMCHTTPClient(
    base_url='https://pro-api.coinmarketcap.com',
    api_key=settings.CMC_API_KEY
)

imei_client = IMEIHTTPClient(
    base_url='https://api.imeicheck.net',
    api_key=settings.IMEI_API_KEY
)