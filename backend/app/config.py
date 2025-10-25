"""
Application configuration
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings"""

    # Application
    APP_NAME: str = "Webcam Pulse Detector API"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:80",
        "http://localhost",
    ]

    # Camera settings
    CAMERA_DEVICES: List[int] = [0, 1]
    DEFAULT_CAMERA: int = 0

    # Pulse detection settings
    BPM_MIN: int = int(os.getenv("BPM_MIN", "50"))
    BPM_MAX: int = int(os.getenv("BPM_MAX", "180"))
    BUFFER_SIZE: int = 250
    DATA_SPIKE_LIMIT: float = 2500.0
    FACE_DETECTOR_SMOOTHNESS: int = 10

    # Video settings
    FRAME_WIDTH: int = 640
    FRAME_HEIGHT: int = 480
    JPEG_QUALITY: int = 80
    TARGET_FPS: int = 30

    # Data storage
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(os.getcwd(), "data"))

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info").upper()

    class Config:
        case_sensitive = True

    @field_validator("CAMERA_DEVICES", mode="before")
    def parse_camera_devices(cls, v):
        if isinstance(v, str):
            return [int(x.strip()) for x in v.split(",") if x.strip()]
        return v


settings = Settings()
