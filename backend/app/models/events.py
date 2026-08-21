from enum import Enum
from typing import Any
from pydantic import BaseModel, ConfigDict


class EventType(str, Enum):
    INITIAL_STATE = "INITIAL_STATE"
    GAME_STATE_UPDATE = "GAME_STATE_UPDATE"
    TIMER_ALERT = "TIMER_ALERT"
    SOUND_CUE = "SOUND_CUE"
    ROSHAN_ALERT = "ROSHAN_ALERT"
    BUYBACK_ALERT = "BUYBACK_ALERT"
    PING = "PING"
    PONG = "PONG"


class SoundCuePayload(BaseModel):
    model_config = ConfigDict(extra="ignore")

    sound_id: str
    label: str
    urgency: str = "normal"
    volume: float = 1.0


class WSMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    type: EventType
    timestamp: int
    clock_time: int
    payload: Any
