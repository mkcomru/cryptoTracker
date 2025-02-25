from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    CMC_API_KEY: str
    IMEI_API_KEY: str
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file='D:\CryptoTracker\.env')


settings = Settings()