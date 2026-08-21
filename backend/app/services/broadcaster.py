import asyncio
import time
from typing import Set
from fastapi import WebSocket
from app.models.events import WSMessage, EventType
from app.models.state import ProcessedGameState
from app.core.logging import logger


class Broadcaster:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, current_state: ProcessedGameState):
        await websocket.accept()
        async with self._lock:
            self.active_connections.add(websocket)
        logger.info(f"WS client connected. Total: {len(self.active_connections)}")

        initial_msg = WSMessage(
            type=EventType.INITIAL_STATE,
            timestamp=int(time.time() * 1000),
            clock_time=current_state.clock_time,
            payload=current_state.model_dump(),
        )
        await websocket.send_text(initial_msg.model_dump_json())

    async def disconnect(self, websocket: WebSocket):
        async with self._lock:
            self.active_connections.discard(websocket)
        logger.info(f"WS client disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast(self, message: WSMessage):
        if not self.active_connections:
            return

        payload_json = message.model_dump_json()

        async with self._lock:
            if not self.active_connections:
                return
            connections = list(self.active_connections)

        # Broadcast concurrently across all active clients
        results = await asyncio.gather(
            *[conn.send_text(payload_json) for conn in connections],
            return_exceptions=True,
        )

        dead: Set[WebSocket] = set()
        for conn, res in zip(connections, results):
            if isinstance(res, Exception):
                dead.add(conn)

        if dead:
            async with self._lock:
                self.active_connections -= dead
            logger.info(f"Cleaned up {len(dead)} dead WS connections.")

    async def broadcast_state_update(self, state: ProcessedGameState):
        msg = WSMessage(
            type=EventType.GAME_STATE_UPDATE,
            timestamp=int(time.time() * 1000),
            clock_time=state.clock_time,
            payload=state.model_dump(),
        )
        await self.broadcast(msg)


broadcaster = Broadcaster()
