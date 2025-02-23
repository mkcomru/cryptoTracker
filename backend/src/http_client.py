from aiohttp import ClientSession
from src.config import settings 
from async_lru import alru_cache


class HTTPClient:
    def __init__(self, base_url: str, api_key: str):
        self.session = ClientSession(
            base_url=base_url,
            headers={
                'X-CMC_PRO_API_KEY': api_key,
                'Authorization': 'Bearer ' + api_key,
                'Accept-Language': 'en',
                'Content-Type': 'application/json'
            }
        )
    
    async def close(self):
        if not self.session.closed:
            await self.session.close()


class IMEIHTTPClient(HTTPClient):
    async def get_imei_info(self, imei: int):
        async with self.session.post(
            '/v1/checks',
            params={"deviceId": imei, "serviceId": 1}
        ) as response:
            result = await response.json()
            return result


class CMCHTTPClient(HTTPClient):
    @alru_cache
    async def get_listings(self):
        async with self.session.get('/v1/cryptocurrency/listings/latest') as response:
            result = await response.json()
            return result['data']
        
    @alru_cache
    async def get_currency(self, currency_id: int):
        async with self.session.get(
            '/v2/cryptocurrency/quotes/latest', 
            params={"id": currency_id}
        ) as response:
            result = await response.json()
            return result['data'][str(currency_id)]
