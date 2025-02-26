from aiohttp import ClientSession


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


