"""Central application configuration.

All settings come from environment variables prefixed with BLUEMAN_
(see backend/.env.example). Values are validated once at import time;
any missing required value fails fast at startup, not at request time.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="BLUEMAN_", env_file=".env", extra="ignore")

    env: str = "development"
    secret_key: str = "dev-only-secret-do-not-use-in-prod"
    database_url: str = "sqlite:///./blueman.db"

    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-5"

    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str = ""
    embedding_dim: int = 1024

    cors_origins: list[str] = ["http://localhost:5173"]
    access_token_expire_minutes: int = 60 * 24
    rate_limit: str = "120/minute"

    @property
    def is_production(self) -> bool:
        return self.env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
