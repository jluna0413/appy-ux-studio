import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

class Settings(BaseSettings):
    APP_NAME: str = "Appy-UX Studio API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'appyux.db'}"
    
    # Auth
    SECRET_KEY: str = "change-me-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # ComfyUI
    COMFYUI_URL: str = "http://localhost:8188"
    COMFYUI_OUTPUT_DIR: str = "E:/AI Playground/resources/ComfyUI/output"
    
    # PayPal
    PAYPAL_CLIENT_ID: str = "your-paypal-client-id"
    PAYPAL_CLIENT_SECRET: str = "your-paypal-client-secret"
    PAYPAL_MODE: str = "sandbox"  # sandbox or live
    
    # Stripe (alternative)
    STRIPE_SECRET_KEY: str = "sk_test_..."
    STRIPE_WEBHOOK_SECRET: str = "whsec_..."
    
    # Email (optional)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    
    # Storage
    MAX_UPLOAD_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: list = ["jpg", "jpeg", "png", "tif", "tiff", "mp4", "mov", "wav", "mp3", "zip"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
