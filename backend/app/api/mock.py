import asyncio
import time
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.models.gsi_models import (
    GSIPayload, Provider, MapData, PlayerData, HeroData,
    AbilityData, ItemData, AuthData,
)
from app.engine.state_store import state_store
from app.services.broadcaster import broadcaster
from app.services.sound_trigger import sound_trigger_service
from app.models.events import WSMessage, EventType
from app.core.logging import logger

router = APIRouter(prefix="/api/v1/mock", tags=["Mock"])

ITEM_PROGRESSION = [
    (0, "item_tango", 2),
    (10, "item_power_treads", 0),
    (15, "item_bfury", 0),
    (22, "item_manta", 0),
    (30, "item_black_king_bar", 0),
    (35, "item_abyssal_blade", 0),
    (40, "item_butterfly", 0),
]

NEUTRAL_PROGRESSION = [
    (7, "item_philosophers_stone"),
    (17, "item_vambrace"),
    (27, "item_mind_breaker"),
]


class MockStartRequest(BaseModel):
    speed: float = 1.0
    start_time: int = -30
    hero_name: str = "npc_dota_hero_antimage"


def _build_items(minutes: int) -> dict:
    slots = ["slot0", "slot1", "slot2", "slot3", "slot4", "slot5"]
    items_dict = {s: ItemData(name="empty") for s in slots}

    accumulated = []
    if minutes >= 0:
        accumulated.append("item_tango")
    if minutes >= 5:
        accumulated.append("item_power_treads")
    if minutes >= 14:
        accumulated.append("item_bfury")
    if minutes >= 22:
        accumulated.append("item_manta")
    if minutes >= 30:
        accumulated.append("item_black_king_bar")
    if minutes >= 36:
        accumulated.append("item_butterfly")
    if minutes >= 42:
        accumulated.append("item_abyssal_blade")

    for idx, item_name in enumerate(accumulated[-6:]):
        charges = 3 if item_name == "item_tango" else 0
        items_dict[f"slot{idx}"] = ItemData(name=item_name, charges=charges)

    neutral_item = ItemData(name="empty")
    for threshold, item_name in reversed(NEUTRAL_PROGRESSION):
        if minutes >= threshold:
            neutral_item = ItemData(name=item_name)
            break

    items_dict["teleport0"] = ItemData(name="item_tpscroll", charges=2)
    items_dict["neutral0"] = neutral_item
    return items_dict


def _build_abilities(level: int) -> dict:
    return {
        "ability0": AbilityData(name="antimage_mana_break", level=min(4, 1 + level // 3), passive=True),
        "ability1": AbilityData(name="antimage_blink", level=min(4, 1 + level // 3), can_cast=True),
        "ability2": AbilityData(name="antimage_counterspell", level=min(4, 1 + level // 4), can_cast=True),
        "ability3": AbilityData(name="antimage_mana_void", level=min(3, max(0, level // 6)), can_cast=True, ultimate=True),
    }


class MockSimulator:
    def __init__(self):
        self.is_running: bool = False
        self.clock_time: int = -30
        self.speed: float = 1.0
        self.hero_name: str = "npc_dota_hero_antimage"
        self._task: Optional[asyncio.Task] = None

    def start(self, speed: float = 1.0, start_time: int = -30, hero_name: str = "npc_dota_hero_antimage"):
        self.stop()
        self.is_running = True
        self.speed = max(0.2, min(speed, 20.0))
        self.clock_time = start_time
        self.hero_name = hero_name
        self._task = asyncio.create_task(self._run_loop())
        logger.info(f"Mock started at {start_time}s, speed={speed}x")

    def stop(self):
        if self._task and not self._task.done():
            self._task.cancel()
        self.is_running = False
        self._task = None

    def _generate_payload(self) -> GSIPayload:
        ct = self.clock_time
        minutes = max(0, ct // 60)
        level = min(30, max(1, 1 + minutes // 2))
        kills = min(25, minutes // 3)
        deaths = min(10, minutes // 8)
        assists = min(30, minutes // 2)
        last_hits = max(0, minutes * 11 + (ct % 60) // 5)
        denies = max(0, min(30, minutes * 2))

        hero_damage = max(0, minutes * 850 + kills * 900 + last_hits * 15)
        gold_reliable = 200 + kills * 250
        gold_unreliable = max(100, last_hits * 40 + minutes * 100)
        total_gold = gold_reliable + gold_unreliable
        gpm = int(total_gold / max(1, minutes)) if minutes > 0 else 300
        xpm = int(level * 600 / max(1, minutes)) if minutes > 0 else 350
        net_worth = total_gold + minutes * 500
        buyback_cost = int(100 + net_worth / 13 + level * 10)
        max_hp = 600 + level * 90
        max_mp = 300 + level * 45

        is_daytime = (ct // 300) % 2 == 0 if ct >= 0 else False
        game_state = "DOTA_GAMERULES_STATE_PRE_GAME" if ct < 0 else "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS"

        roshan_state = "alive"
        roshan_state_end = 0
        if 900 <= ct < 1200:
            roshan_state = "respawn_base"
            roshan_state_end = 1200 - ct

        return GSIPayload(
            provider=Provider(name="Dota 2", appid=570, version=50, timestamp=int(time.time())),
            map=MapData(
                matchid="7788991122",
                game_time=max(0, ct + 90),
                clock_time=ct,
                daytime=is_daytime,
                game_state=game_state,
                paused=False,
                radiant_score=kills + 4,
                dire_score=deaths + 8,
                roshan_state=roshan_state,
                roshan_state_end_seconds=roshan_state_end,
            ),
            player=PlayerData(
                steamid="76561198000000000",
                name="Simulation",
                activity="playing",
                kills=kills,
                deaths=deaths,
                assists=assists,
                last_hits=last_hits,
                denies=denies,
                hero_damage=hero_damage,
                gold=total_gold,
                gold_reliable=gold_reliable,
                gold_unreliable=gold_unreliable,
                gpm=gpm,
                xpm=xpm,
                net_worth=net_worth,
            ),
            hero=HeroData(
                id=1,
                name=self.hero_name,
                level=level,
                alive=True,
                respawn_seconds=0,
                buyback_cost=buyback_cost,
                buyback_cooldown=0,
                health=max_hp,
                max_health=max_hp,
                health_percent=100,
                mana=max_mp,
                max_mana=max_mp,
                mana_percent=100,
                aghanims_shard=minutes >= 18,
            ),
            abilities=_build_abilities(level),
            items=_build_items(minutes),
            auth=AuthData(token="dota2_insight_secure_local_token"),
        )

    async def _run_loop(self):
        try:
            while self.is_running:
                payload = self._generate_payload()
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
                self.clock_time += 1
                await asyncio.sleep(1.0 / self.speed)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"Mock loop error: {e}", exc_info=True)


simulator = MockSimulator()


@router.post("/start")
async def start_mock(request: MockStartRequest):
    simulator.start(speed=request.speed, start_time=request.start_time, hero_name=request.hero_name)
    return {"status": "started", "speed": simulator.speed, "clock_time": simulator.clock_time}


@router.post("/stop")
async def stop_mock():
    simulator.stop()
    return {"status": "stopped"}


@router.get("/status")
async def mock_status():
    return {
        "is_running": simulator.is_running,
        "clock_time": simulator.clock_time,
        "speed": simulator.speed,
        "hero_name": simulator.hero_name,
    }
