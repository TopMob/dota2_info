import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.logging import logger
from app.api.routes import api_router
from app.engine.state_store import state_store

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
INDEX_PATH = os.path.join(STATIC_DIR, "index.html")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Dota 2 Insight Backend starting up")
    logger.info(f"Dashboard UI: http://{settings.HOST}:{settings.PORT}/")
    logger.info(f"GSI endpoint: http://{settings.HOST}:{settings.PORT}/api/v1/gsi")
    logger.info(f"WebSocket: ws://{settings.HOST}:{settings.PORT}/ws/live-feed")
    yield
    logger.info("Dota 2 Insight Backend shutting down")


app = FastAPI(
    title="Dota 2 Insight Core API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
async def index():
    if os.path.exists(INDEX_PATH):
        return FileResponse(INDEX_PATH)
    return {"message": "Dota 2 Insight Backend Running"}


@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "dota2_insight_backend",
        "is_connected_to_game": state_store.processed_state.is_connected,
        "match_id": state_store.processed_state.match_id,
        "clock_time": state_store.processed_state.clock_time,
    }


@app.get("/api/v1/state")
async def get_current_state():
    return state_store.processed_state
