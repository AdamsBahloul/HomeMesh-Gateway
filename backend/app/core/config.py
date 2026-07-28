from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartBridge OS API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-jwt-signing-key-change-in-production-min-32-chars"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./smartbridge.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # MQTT
    MQTT_BROKER_HOST: str = "localhost"
    MQTT_BROKER_PORT: int = 1883
    
    class Config:
        case_sensitive = True

settings = Settings()
