import time
from fastapi import APIRouter, BackgroundTasks, Response, status
from app.models.gsi_models import GSIPayload
from app.models.events import WSMessage, EventType
from app.engine.state_store import state_store
from app.services.broadcaster import broadcaster
from app.services.sound_trigger import sound_trigger_service
from app.core.config import settings
from app.core.logging import logger

router = APIRouter(prefix="/api/v1", tags=["GSI"])


async def _process_payload(payload: GSIPayload):
    try:
        state = state_store.update(payload)

        for cue in sound_trigger_service.evaluate(state):
            cue_msg = WSMessage(
                type=EventType.SOUND_CUE,
                timestamp=int(time.time() * 1000),
                clock_time=state.clock_time,
                payload=cue.model_dump(),
            )
            await broadcaster.broadcast(cue_msg)

        await broadcaster.broadcast_state_update(state)
    except Exception as e:
        logger.error(f"GSI processing error: {e}", exc_info=True)


@router.post("/gsi", status_code=status.HTTP_200_OK)
async def receive_gsi(payload: GSIPayload, background_tasks: BackgroundTasks):
    if payload.auth and payload.auth.token:
        if settings.GSI_AUTH_TOKEN and payload.auth.token != settings.GSI_AUTH_TOKEN:
            return Response(status_code=status.HTTP_401_UNAUTHORIZED)

    background_tasks.add_task(_process_payload, payload)
    return {"status": "ok"}
