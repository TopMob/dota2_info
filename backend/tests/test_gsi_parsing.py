import pytest
from app.models.gsi_models import GSIPayload


def test_parse_full_payload():
    raw_payload = {
        "provider": {"name": "Dota 2", "appid": 570, "version": 50, "timestamp": 1720000000},
        "map": {
            "name": "start",
            "matchid": "7891234567",
            "game_time": 620,
            "clock_time": 530,
            "daytime": True,
            "game_state": "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS",
            "paused": False,
            "roshan_state": "alive",
            "roshan_state_end_seconds": 0,
            "radiant_score": 5,
            "dire_score": 3,
        },
        "player": {
            "steamid": "76561198000000000",
            "name": "PlayerOne",
            "kills": 3,
            "deaths": 0,
            "assists": 2,
            "last_hits": 65,
            "denies": 8,
            "gold": 2100,
            "gold_reliable": 500,
            "gold_unreliable": 1600,
            "gpm": 480,
            "xpm": 540,
            "net_worth": 4500,
        },
        "hero": {
            "id": 1,
            "name": "npc_dota_hero_antimage",
            "level": 9,
            "alive": True,
            "buyback_cost": 480,
            "buyback_cooldown": 0,
            "health": 950,
            "max_health": 950,
            "mana": 420,
            "max_mana": 480,
            "silenced": False,
            "stunned": False,
        },
        "abilities": {
            "ability0": {"name": "antimage_mana_break", "level": 4, "can_cast": False, "passive": True},
            "ability1": {"name": "antimage_blink", "level": 4, "can_cast": True, "cooldown": 0},
        },
        "items": {
            "slot0": {"name": "item_power_treads", "can_cast": True, "cooldown": 0},
            "teleport0": {"name": "item_tpscroll", "charges": 2},
        },
        "auth": {"token": "dota2_insight_secure_local_token"},
    }

    payload = GSIPayload.model_validate(raw_payload)
    assert payload.provider.name == "Dota 2"
    assert payload.map.matchid == "7891234567"
    assert payload.map.clock_time == 530
    assert payload.player.gold == 2100
    assert payload.hero.name == "npc_dota_hero_antimage"
    assert payload.abilities["ability1"].name == "antimage_blink"
    assert payload.items["slot0"].name == "item_power_treads"


def test_resilience_with_unknown_fields():
    raw_payload = {
        "map": {
            "matchid": "9999999",
            "clock_time": 100,
            "valve_future_unannounced_metric_xyz": 12345,
            "new_patch_nested_data": {"flag": True, "values": [1, 2, 3]},
        },
        "brand_new_top_level_section": {
            "some_data": "valve_added_this",
        },
    }

    payload = GSIPayload.model_validate(raw_payload)
    assert payload.map.matchid == "9999999"
    assert payload.map.clock_time == 100


def test_empty_payload():
    payload = GSIPayload.model_validate({})
    assert payload.map is None
    assert payload.hero is None
    assert payload.player is None
