from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class UrgencyLevel(str, Enum):
    NORMAL = "normal"
    WARNING_30S = "warning_30s"
    CRITICAL_10S = "critical_10s"
    ACTIVE = "active"


class TimerCategory(str, Enum):
    WATER_RUNE = "water_rune"
    BOUNTY_RUNE = "bounty_rune"
    POWERUP_RUNE = "powerup_rune"
    WISDOM_RUNE = "wisdom_rune"
    LOTUS_POOL = "lotus_pool"
    NEUTRAL_TIER = "neutral_tier"
    TORMENTOR = "tormentor"
    DAY_NIGHT = "day_night"
    STACK_PULL = "stack_pull"
    ROSHAN = "roshan"


class TacticalTimer(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    category: TimerCategory
    name: str
    remaining_seconds: int
    next_event_time: int
    urgency: UrgencyLevel
    icon: str
    description: str


class BuybackStatus(str, Enum):
    READY = "READY"
    NO_GOLD = "NO_GOLD"
    COOLDOWN = "COOLDOWN"


class EconomyAnalytics(BaseModel):
    model_config = ConfigDict(extra="ignore")

    gold: int = 0
    gold_reliable: int = 0
    gold_unreliable: int = 0
    net_worth: int = 0
    gpm: int = 0
    xpm: int = 0
    last_hits: int = 0
    denies: int = 0
    cs_per_min: float = 0.0
    buyback_cost: int = 0
    buyback_cooldown: int = 0
    buyback_status: BuybackStatus = BuybackStatus.READY
    gold_surplus: int = 0
    gold_deficit: int = 0


class RoshanStatus(str, Enum):
    ALIVE = "alive"
    AEGIS_HELD = "aegis_held"
    RESPAWN_WINDOW = "respawn_window"
    RESPAWN_GUARANTEED = "respawn_guaranteed"
    UNKNOWN = "unknown"


class RoshanAnalytics(BaseModel):
    model_config = ConfigDict(extra="ignore")

    status: RoshanStatus = RoshanStatus.ALIVE
    state_end_seconds: int = 0
    death_clock_time: Optional[int] = None
    aegis_expires_clock: Optional[int] = None
    min_respawn_clock: Optional[int] = None
    max_respawn_clock: Optional[int] = None
    death_count: int = 0
    expected_drops: List[str] = ["Aegis of the Immortal"]


class HeroStatusInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")

    hero_id: Optional[int] = None
    hero_name: Optional[str] = "Unknown"
    hero_display_name: str = "Hero"
    level: int = 1
    alive: bool = True
    respawn_seconds: int = 0
    health: int = 0
    max_health: int = 0
    health_percent: int = 100
    mana: int = 0
    max_mana: int = 0
    mana_percent: int = 100
    active_debuffs: List[str] = []


class DamageBreakdown(BaseModel):
    model_config = ConfigDict(extra="ignore")

    physical_damage: int = 0
    physical_pct: float = 60.0
    magical_damage: int = 0
    magical_pct: float = 35.0
    pure_damage: int = 0
    pure_pct: float = 5.0


class DefenseMatrix(BaseModel):
    model_config = ConfigDict(extra="ignore")

    armor: float = 3.0
    physical_reduction_pct: float = 15.0
    magic_resistance_pct: float = 25.0
    pure_vulnerability_pct: float = 100.0


class DamageAnalytics(BaseModel):
    model_config = ConfigDict(extra="ignore")

    total_hero_damage: int = 0
    dpm: float = 0.0
    breakdown: DamageBreakdown = DamageBreakdown()
    defense: DefenseMatrix = DefenseMatrix()


class ItemRecommendation(BaseModel):
    model_config = ConfigDict(extra="ignore")

    item_id: str
    display_name: str
    cost: int
    remaining_gold: int
    progress_pct: float
    eta_seconds: int
    eta_formatted: str
    is_safe_with_buyback: bool = True
    reason: str
    tags: List[str] = []
    is_situational: bool = False


class ItemPredictorAnalytics(BaseModel):
    model_config = ConfigDict(extra="ignore")

    game_stage: str = "Early Game / Laning"
    next_core_item: Optional[ItemRecommendation] = None
    situational_items: List[ItemRecommendation] = []


class NeutralItemSuggestion(BaseModel):
    model_config = ConfigDict(extra="ignore")

    item_id: str
    name: str
    tier: int
    rank: int
    stat_bonus: str
    ability: str = ""
    synergy_reason: str


class NeutralTierStatus(BaseModel):
    model_config = ConfigDict(extra="ignore")

    tier: int
    name: str
    unlock_clock: int
    is_unlocked: bool
    seconds_remaining: int


class NeutralAdvisorAnalytics(BaseModel):
    model_config = ConfigDict(extra="ignore")

    current_tier: int = 0
    target_tier: int = 1
    seconds_to_next_tier: int = 420
    next_tier_formatted: str = "Tier 1 (at 07:00)"
    equipped_item_name: str = "Empty"
    has_neutral_equipped: bool = False
    tier_statuses: List[NeutralTierStatus] = []
    top_suggestions: List[NeutralItemSuggestion] = []


class FarmPacingGrade(str, Enum):
    S_PLUS = "S+"
    S = "S"
    A = "A"
    B = "B"
    C = "C"


class FarmCoachAnalytics(BaseModel):
    model_config = ConfigDict(extra="ignore")

    grade: FarmPacingGrade = FarmPacingGrade.S
    efficiency_pct: float = 100.0
    target_cs: int = 0
    cs_delta: int = 0
    target_net_worth: int = 600
    net_worth_delta: int = 0
    is_stack_window: bool = False
    stack_countdown_seconds: int = 0
    tactical_tips: List[str] = []


class TormentorStatus(str, Enum):
    NOT_SPAWNED = "not_spawned"
    ALIVE = "alive"
    RESPAWNING = "respawning"


class TormentorAnalytics(BaseModel):
    model_config = ConfigDict(extra="ignore")

    status: TormentorStatus = TormentorStatus.NOT_SPAWNED
    remaining_seconds: int = 1200
    has_shard: bool = False
    shard_advice: str = "Tormentor arrives at 20:00. Grants free Aghanim's Shard."
    should_buy_from_shop: bool = False


class PostGameDebrief(BaseModel):
    model_config = ConfigDict(extra="ignore")

    match_id: str = "Local Session"
    duration_formatted: str = "00:00"
    overall_score: int = 80
    radiant_score: int = 0
    dire_score: int = 0
    total_hero_damage: int = 0
    dpm: float = 0.0
    gpm: int = 0
    xpm: int = 0
    net_worth: int = 0
    last_hits: int = 0
    denies: int = 0
    highlights: List[str] = []
    improvement_areas: List[str] = []


class ProcessedGameState(BaseModel):
    model_config = ConfigDict(extra="ignore")

    is_connected: bool = True
    match_id: Optional[str] = None
    game_time: int = 0
    clock_time: int = 0
    formatted_clock: str = "00:00"
    game_state: str = "DOTA_GAMERULES_STATE_INIT"
    is_daytime: bool = True
    is_paused: bool = False
    radiant_score: int = 0
    dire_score: int = 0
    hero: HeroStatusInfo = HeroStatusInfo()
    economy: EconomyAnalytics = EconomyAnalytics()
    roshan: RoshanAnalytics = RoshanAnalytics()
    timers: List[TacticalTimer] = []
    damage: DamageAnalytics = DamageAnalytics()
    item_prediction: ItemPredictorAnalytics = ItemPredictorAnalytics()
    neutral_advisor: NeutralAdvisorAnalytics = NeutralAdvisorAnalytics()
    farm_coach: FarmCoachAnalytics = FarmCoachAnalytics()
    tormentor: TormentorAnalytics = TormentorAnalytics()
    post_game: Optional[PostGameDebrief] = None
    items: Dict[str, Any] = {}
    abilities: Dict[str, Any] = {}


