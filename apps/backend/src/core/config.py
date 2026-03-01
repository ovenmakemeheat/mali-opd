from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    model_name: str = "google/gemini-2.5-flash"
    app_name: str = "MALI OPD Assistant"
    debug: bool = False
    mockup_mode: bool = False
    llm_provider: Literal["openrouter", "openai"] = "openrouter"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def api_key(self) -> str:
        if self.llm_provider == "openrouter":
            return self.openrouter_api_key
        return self.openai_api_key

    @property
    def base_url(self) -> str:
        if self.llm_provider == "openrouter":
            return self.openrouter_base_url
        return self.openai_base_url


settings = Settings()
