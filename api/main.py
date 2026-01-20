from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import app_config
from src.router import load_routers


# Setup API
app = FastAPI(
    version="0.0.1",
    docs_url=None if app_config.ENV == "production" else "/docs",
    redoc_url=None if app_config.ENV == "production" else "/redoc",
    openapi_url=None if app_config.ENV == "production" else "/openapi.json",
)

@app.get("/health", tags=["Health"])
async def route_health_check():
    return {
        "status": "healthy",
    }


# Load all routers
load_routers(app=app)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
