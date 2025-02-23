from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    CMC_API_KEY: str
    IMEI_API_KEY: str

    model_config = SettingsConfigDict(env_file='D:\CryptoTracker\.env')


settings = Settings()