"""
Application configuration
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    API_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/political_transparency"

    # SMTP Configuration for contact form emails
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_TO_EMAIL: str = "info@transparentpolitics.com"

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Return list of allowed CORS origins"""
        return [self.FRONTEND_URL, "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
