from pydantic import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "Chatbot API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/chatbot")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER")
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # React frontend
        "https://your-production-frontend.com"
    ]

settings = Settings()