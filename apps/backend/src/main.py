from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.api import consultation, health
from src.core.config import settings

load_dotenv()

app = FastAPI(
    title=settings.app_name,
    description="Ambient OPD Assistant with AI-powered clinical support",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(consultation.router, prefix="/api", tags=["Consultation"])


@app.get("/")
async def root():
    return {
        "message": "MALI OPD Assistant API",
        "status": "running",
        "mockup_mode": settings.mockup_mode,
        "llm_provider": settings.llm_provider,
        "model": settings.model_name,
    }
