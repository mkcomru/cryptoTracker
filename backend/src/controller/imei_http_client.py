from src.controller.http_client import HTTPClient


class IMEIHTTPClient(HTTPClient):
    async def get_imei_info(self, imei: int):
        async with self.session.post(
            '/v1/checks',
            params={"deviceId": imei, "serviceId": 1}
        ) as response:
            result = await response.json()
            return result