from typing import List, Set
from app.models.state import ProcessedGameState
from app.models.events import SoundCuePayload


ALERT_RULES = [
    {
        "timer_id": "wisdom_rune",
        "range": (20, 26),
        "sound_id": "wisdom_rune_warning",
        "label": "Wisdom Rune in 25s",
        "urgency": "warning",
        "volume": 1.0,
    },
    {
        "timer_id": "lotus_pool",
        "range": (10, 16),
        "sound_id": "lotus_pool_warning",
        "label": "Lotus Pool in 15s",
        "urgency": "normal",
        "volume": 0.8,
    },
    {
        "timer_id": "stack_pull",
        "range": (2, 4),
        "sound_id": "stack_alert",
        "label": "Stack camp (:53)",
        "urgency": "normal",
        "volume": 0.7,
    },
    {
        "timer_id": "tormentor_initial",
        "range": (18, 22),
        "sound_id": "tormentor_warning",
        "label": "Tormentor spawning in 20s",
        "urgency": "warning",
        "volume": 0.9,
    },
]

NEUTRAL_UNLOCK_RANGE = (0, 2)
MAX_CACHED_EVENTS = 100


class SoundTriggerService:
    def __init__(self):
        self._triggered: Set[str] = set()
        self._last_match_id: str = ""

    def evaluate(self, state: ProcessedGameState) -> List[SoundCuePayload]:
        cues: List[SoundCuePayload] = []

        if state.match_id and state.match_id != self._last_match_id:
            self._triggered.clear()
            self._last_match_id = state.match_id

        for timer in state.timers:
            remaining = timer.remaining_seconds
            event_time = timer.next_event_time

            for rule in ALERT_RULES:
                if timer.id != rule["timer_id"]:
                    continue
                lo, hi = rule["range"]
                if lo <= remaining <= hi:
                    key = f"{rule['sound_id']}_{event_time}"
                    if key not in self._triggered:
                        self._triggered.add(key)
                        cues.append(SoundCuePayload(
                            sound_id=rule["sound_id"],
                            label=rule["label"],
                            urgency=rule["urgency"],
                            volume=rule["volume"],
                        ))

            if "neutral_tier" in timer.id:
                lo, hi = NEUTRAL_UNLOCK_RANGE
                if lo <= remaining <= hi:
                    key = f"neutrals_unlocked_{event_time}"
                    if key not in self._triggered:
                        self._triggered.add(key)
                        cues.append(SoundCuePayload(
                            sound_id="neutrals_unlocked",
                            label=f"{timer.name} unlocked!",
                            urgency="critical",
                            volume=1.0,
                        ))

        if len(self._triggered) > MAX_CACHED_EVENTS:
            self._triggered.clear()

        return cues


sound_trigger_service = SoundTriggerService()
