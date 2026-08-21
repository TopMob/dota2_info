import time
from typing import Optional, List
from app.models.gsi_models import GSIPayload, HeroData
from app.models.state import ProcessedGameState, HeroStatusInfo
from app.engine.timer_engine import compute_active_timers
from app.engine.roshan_engine import roshan_tracker
from app.engine.economy_engine import compute_economy
from app.engine.damage_engine import compute_damage_analytics
from app.engine.recommendation_engine import compute_item_recommendations
from app.engine.neutral_engine import compute_neutral_advisor
from app.engine.farm_coach_engine import compute_farm_coach
from app.engine.tormentor_engine import compute_tormentor_analytics
from app.engine.post_game_engine import generate_post_game_debrief

DEBUFF_FIELDS = [
    ("stunned", "Stunned"),
    ("silenced", "Silenced"),
    ("hexed", "Hexed"),
    ("disarmed", "Disarmed"),
    ("muted", "Muted"),
    ("break_", "Break"),
    ("magicimmune", "BKB"),
    ("smoked", "Smoked"),
]


def _format_hero_name(raw_name: Optional[str]) -> str:
    if not raw_name:
        return "Hero"
    clean = raw_name.replace("npc_dota_hero_", "")
    return " ".join(part.capitalize() for part in clean.split("_"))


def _format_clock(clock_time: Optional[int]) -> str:
    if clock_time is None:
        return "00:00"
    is_negative = clock_time < 0
    abs_seconds = abs(clock_time)
    minutes = abs_seconds // 60
    seconds = abs_seconds % 60
    prefix = "-" if is_negative else ""
    return f"{prefix}{minutes:02d}:{seconds:02d}"


def _extract_debuffs(hero_data: Optional[HeroData]) -> List[str]:
    if not hero_data:
        return []
    return [
        label for field, label in DEBUFF_FIELDS
        if getattr(hero_data, field, False)
    ]


class StateStore:
    def __init__(self):
        self.current_payload: Optional[GSIPayload] = None
        self.previous_payload: Optional[GSIPayload] = None
        self.processed_state: ProcessedGameState = ProcessedGameState(is_connected=False)
        self.last_update_timestamp: float = 0.0

    def update(self, payload: GSIPayload) -> ProcessedGameState:
        self.previous_payload = self.current_payload
        self.current_payload = payload
        self.last_update_timestamp = time.time()

        map_data = payload.map
        player_data = payload.player
        hero_data = payload.hero
        abilities_data = payload.abilities or {}
        items_data = payload.items or {}

        clock_time = map_data.clock_time if map_data else 0
        game_time = map_data.game_time if map_data else 0
        game_state = map_data.game_state if map_data else "DOTA_GAMERULES_STATE_INIT"

        hero_status = HeroStatusInfo(
            hero_id=hero_data.id if hero_data else None,
            hero_name=hero_data.name if hero_data else "Unknown",
            hero_display_name=_format_hero_name(hero_data.name if hero_data else None),
            level=hero_data.level or 1 if hero_data else 1,
            alive=hero_data.alive if (hero_data and hero_data.alive is not None) else True,
            respawn_seconds=hero_data.respawn_seconds or 0 if hero_data else 0,
            health=hero_data.health or 0 if hero_data else 0,
            max_health=hero_data.max_health or 0 if hero_data else 0,
            health_percent=hero_data.health_percent or 100 if hero_data else 100,
            mana=hero_data.mana or 0 if hero_data else 0,
            max_mana=hero_data.max_mana or 0 if hero_data else 0,
            mana_percent=hero_data.mana_percent or 100 if hero_data else 100,
            active_debuffs=_extract_debuffs(hero_data),
        )

        economy = compute_economy(player_data, hero_data, clock_time)
        roshan = roshan_tracker.compute(map_data)
        timers = compute_active_timers(clock_time, game_state)
        damage = compute_damage_analytics(player_data, hero_data, abilities_data, items_data, clock_time)
        item_prediction = compute_item_recommendations(player_data, hero_data, items_data, economy.gold_surplus, clock_time)
        neutral_advisor = compute_neutral_advisor(hero_data, items_data, clock_time)
        farm_coach = compute_farm_coach(player_data, hero_data, clock_time)
        tormentor = compute_tormentor_analytics(hero_data, player_data, clock_time)

        post_game = None
        if game_state in ["DOTA_GAMERULES_STATE_POST_GAME", "DOTA_GAMERULES_STATE_DISCONNECT"]:
            post_game = generate_post_game_debrief(
                match_id=map_data.matchid if map_data else None,
                clock_time=clock_time,
                radiant_score=map_data.radiant_score or 0 if map_data else 0,
                dire_score=map_data.dire_score or 0 if map_data else 0,
                hero=hero_status,
                economy=economy,
                damage=damage,
            )

        self.processed_state = ProcessedGameState(
            is_connected=True,
            match_id=map_data.matchid if map_data else None,
            game_time=game_time or 0,
            clock_time=clock_time or 0,
            formatted_clock=_format_clock(clock_time),
            game_state=game_state,
            is_daytime=map_data.daytime if (map_data and map_data.daytime is not None) else True,
            is_paused=map_data.paused if (map_data and map_data.paused is not None) else False,
            radiant_score=map_data.radiant_score or 0 if map_data else 0,
            dire_score=map_data.dire_score or 0 if map_data else 0,
            hero=hero_status,
            economy=economy,
            roshan=roshan,
            timers=timers,
            damage=damage,
            item_prediction=item_prediction,
            neutral_advisor=neutral_advisor,
            farm_coach=farm_coach,
            tormentor=tormentor,
            post_game=post_game,
            items={k: v.model_dump() for k, v in items_data.items()},
            abilities={k: v.model_dump() for k, v in abilities_data.items()},
        )

        return self.processed_state


state_store = StateStore()
