"""
UrbanEcoTwin-NetZero — FastAPI Backend
Multi-Agent AI-Powered Digital Twin for Net-Zero Sustainability Planning
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.api import router as api_router

app = FastAPI(
    title="UrbanEcoTwin-NetZero API",
    description="AI-Powered Digital Twin for Net-Zero Sustainability Planning",
    version="1.0.0",
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "project": "UrbanEcoTwin-NetZero",
        "version": "1.0.0",
        "description": "Multi-Agent AI-Powered Digital Twin for Net-Zero Sustainability Planning",
        "docs": "/docs",
        "api_base": "/api",
    }
