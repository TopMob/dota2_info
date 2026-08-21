from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.broadcaster import broadcaster
from app.engine.state_store import state_store
from app.core.logging import logger

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/live-feed")
async def websocket_live_feed(websocket: WebSocket):
    await broadcaster.connect(websocket, state_store.processed_state)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        await broadcaster.disconnect(websocket)
    except Exception:
        await broadcaster.disconnect(websocket)
