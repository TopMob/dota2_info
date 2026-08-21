"""Router aggregator for all API controllers."""
from fastapi import APIRouter
from app.api.gsi import router as gsi_router
from app.api.ws import router as ws_router
from app.api.mock import router as mock_router

api_router = APIRouter()
api_router.include_router(gsi_router)
api_router.include_router(ws_router)
api_router.include_router(mock_router)
