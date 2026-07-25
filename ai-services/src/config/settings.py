from pydantic import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "shadowprotocol-ai-services"
    DEBUG: bool = True
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    OPENAI_API_KEY: str | None = None
    VECTOR_DB_PATH: str = "./data/models/vector_db"
    DEFAULT_LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 3002

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
