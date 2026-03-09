"""
Core application configuration.

Reads from environment variables and provides typed settings.
"""

import os
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # App
    APP_NAME: str = "HVAC Analytics API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, description="Enable debug mode")

    # Server
    HOST: str = Field(default="0.0.0.0", description="Server host")
    PORT: int = Field(default=8000, description="Server port")

    # CORS
    FRONTEND_URL: str = Field(
        default="http://localhost:3000",
        description="Frontend URL for CORS",
    )

    # Supabase (future)
    SUPABASE_URL: str = Field(default="", description="Supabase project URL")
    SUPABASE_KEY: str = Field(default="", description="Supabase anon key")
    SUPABASE_SERVICE_KEY: str = Field(default="", description="Supabase service role key")

    # ML Models
    MODEL_DIR: str = Field(
        default="app/ml_models/trained",
        description="Directory for trained model weights",
    )

    # Data
    UPLOAD_DIR: str = Field(
        default="/tmp/hvac_uploads",
        description="Temporary directory for uploaded files",
    )
    MAX_UPLOAD_SIZE_MB: int = Field(default=100, description="Maximum upload file size in MB")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Singleton
settings = Settings()
