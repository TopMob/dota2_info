from typing import Dict, Optional, Any
from pydantic import BaseModel, ConfigDict, Field


class BaseGSIModel(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)


class Provider(BaseGSIModel):
    name: Optional[str] = None
    appid: Optional[int] = None
    version: Optional[int] = None
    timestamp: Optional[int] = None


class MapData(BaseGSIModel):
    name: Optional[str] = None
    matchid: Optional[str] = None
    game_time: Optional[int] = None
    clock_time: Optional[int] = None
    daytime: Optional[bool] = None
    nightstalker_night: Optional[bool] = None
    game_state: Optional[str] = None
    paused: Optional[bool] = None
    win_team: Optional[str] = None
    customgamename: Optional[str] = None
    radiant_ward_purchase_cooldown: Optional[int] = None
    dire_ward_purchase_cooldown: Optional[int] = None
    roshan_state: Optional[str] = None
    roshan_state_end_seconds: Optional[int] = None
    radiant_score: Optional[int] = None
    dire_score: Optional[int] = None


class PlayerData(BaseGSIModel):
    steamid: Optional[str] = None
    name: Optional[str] = None
    activity: Optional[str] = None
    kills: Optional[int] = 0
    deaths: Optional[int] = 0
    assists: Optional[int] = 0
    last_hits: Optional[int] = 0
    denies: Optional[int] = 0
    kill_streak: Optional[int] = 0
    commands_issued: Optional[int] = 0
    kill_list: Optional[Dict[str, int]] = None
    team_name: Optional[str] = None
    player_slot: Optional[int] = None
    team_slot: Optional[int] = None
    gold: Optional[int] = 0
    gold_reliable: Optional[int] = 0
    gold_unreliable: Optional[int] = 0
    gold_from_hero_kills: Optional[int] = 0
    gold_from_creep_kills: Optional[int] = 0
    gold_from_income: Optional[int] = 0
    gold_from_shared: Optional[int] = 0
    gpm: Optional[int] = 0
    xpm: Optional[int] = 0
    net_worth: Optional[int] = 0
    hero_damage: Optional[int] = 0
    wards_purchased: Optional[int] = 0
    wards_placed: Optional[int] = 0
    wards_destroyed: Optional[int] = 0
    runes_activated: Optional[int] = 0
    camps_stacked: Optional[int] = 0
    support_gold_spent: Optional[int] = 0
    pro_name: Optional[str] = None


class HeroData(BaseGSIModel):
    id: Optional[int] = None
    name: Optional[str] = None
    level: Optional[int] = 1
    xp: Optional[int] = 0
    alive: Optional[bool] = True
    respawn_seconds: Optional[int] = 0
    buyback_cost: Optional[int] = 0
    buyback_cooldown: Optional[int] = 0
    health: Optional[int] = 0
    max_health: Optional[int] = 0
    health_percent: Optional[int] = 100
    mana: Optional[int] = 0
    max_mana: Optional[int] = 0
    mana_percent: Optional[int] = 100
    xpos: Optional[float] = None
    ypos: Optional[float] = None
    silenced: Optional[bool] = False
    stunned: Optional[bool] = False
    disarmed: Optional[bool] = False
    magicimmune: Optional[bool] = False
    hexed: Optional[bool] = False
    muted: Optional[bool] = False
    break_: Optional[bool] = Field(default=False, alias="break")
    smoked: Optional[bool] = False
    has_debuff: Optional[bool] = False
    selected_unit: Optional[bool] = True
    aghanims_scepter: Optional[bool] = False
    aghanims_shard: Optional[bool] = False
    talent_1: Optional[bool] = False
    talent_2: Optional[bool] = False
    talent_3: Optional[bool] = False
    talent_4: Optional[bool] = False
    talent_5: Optional[bool] = False
    talent_6: Optional[bool] = False
    talent_7: Optional[bool] = False
    talent_8: Optional[bool] = False


class AbilityData(BaseGSIModel):
    name: Optional[str] = None
    level: Optional[int] = 0
    can_cast: Optional[bool] = False
    passive: Optional[bool] = False
    ability_active: Optional[bool] = False
    cooldown: Optional[int] = 0
    ultimate: Optional[bool] = False
    charges: Optional[int] = None
    max_charges: Optional[int] = None
    charge_cooldown: Optional[int] = None


class ItemData(BaseGSIModel):
    name: Optional[str] = "empty"
    purchaser: Optional[int] = None
    can_cast: Optional[bool] = False
    cooldown: Optional[int] = 0
    passive: Optional[bool] = False
    item_level: Optional[int] = 1
    charges: Optional[int] = 0
    contains_rune: Optional[str] = None


class BuildingHealth(BaseGSIModel):
    health: Optional[int] = 0
    max_health: Optional[int] = 0


class DraftTeamData(BaseGSIModel):
    home_team: Optional[bool] = None
    bonus_time: Optional[int] = None
    pick0_id: Optional[int] = None
    pick0_class: Optional[str] = None
    pick1_id: Optional[int] = None
    pick1_class: Optional[str] = None
    pick2_id: Optional[int] = None
    pick2_class: Optional[str] = None
    pick3_id: Optional[int] = None
    pick3_class: Optional[str] = None
    pick4_id: Optional[int] = None
    pick4_class: Optional[str] = None
    ban0_id: Optional[int] = None
    ban0_class: Optional[str] = None
    ban1_id: Optional[int] = None
    ban1_class: Optional[str] = None
    ban2_id: Optional[int] = None
    ban2_class: Optional[str] = None
    ban3_id: Optional[int] = None
    ban3_class: Optional[str] = None
    ban4_id: Optional[int] = None
    ban4_class: Optional[str] = None
    ban5_id: Optional[int] = None
    ban5_class: Optional[str] = None
    ban6_id: Optional[int] = None
    ban6_class: Optional[str] = None


class DraftData(BaseGSIModel):
    activeteam: Optional[int] = None
    pick: Optional[bool] = None
    activeteam_time_remaining: Optional[int] = None
    radiant_bonus_time: Optional[int] = None
    dire_bonus_time: Optional[int] = None
    team2: Optional[DraftTeamData] = None
    team3: Optional[DraftTeamData] = None


class AuthData(BaseGSIModel):
    token: Optional[str] = None


class GSIPayload(BaseGSIModel):
    provider: Optional[Provider] = None
    map: Optional[MapData] = None
    player: Optional[PlayerData] = None
    hero: Optional[HeroData] = None
    abilities: Optional[Dict[str, AbilityData]] = None
    items: Optional[Dict[str, ItemData]] = None
    buildings: Optional[Dict[str, Dict[str, BuildingHealth]]] = None
    draft: Optional[DraftData] = None
    wearables: Optional[Dict[str, Any]] = None
    auth: Optional[AuthData] = None
    previously: Optional[Dict[str, Any]] = None
    added: Optional[Dict[str, Any]] = None
    team2: Optional[Dict[str, Any]] = None
    team3: Optional[Dict[str, Any]] = None
