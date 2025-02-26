from src.controller.http_client import HTTPClient
from async_lru import alru_cache


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