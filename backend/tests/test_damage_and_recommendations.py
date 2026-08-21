import pytest
from app.models.gsi_models import PlayerData, HeroData, ItemData, AbilityData
from app.engine.damage_engine import compute_damage_analytics
from app.engine.recommendation_engine import compute_item_recommendations


def test_damage_analytics_antimage():
    player = PlayerData(hero_damage=12500)
    hero = HeroData(name="npc_dota_hero_antimage", level=15)
    abilities = {
        "ability0": AbilityData(name="antimage_mana_break", level=4),
        "ability3": AbilityData(name="antimage_mana_void", level=2),
    }
    items = {
        "slot0": ItemData(name="item_bfury"),
        "slot1": ItemData(name="item_manta"),
    }
    analytics = compute_damage_analytics(player, hero, abilities, items, clock_time=1200)

    assert analytics.total_hero_damage == 12500
    assert analytics.dpm > 0
    assert analytics.breakdown.physical_pct > 0
    assert analytics.breakdown.magical_pct > 0
    assert round(analytics.breakdown.physical_pct + analytics.breakdown.magical_pct + analytics.breakdown.pure_pct) == 100
    assert analytics.breakdown.physical_damage + analytics.breakdown.magical_damage + analytics.breakdown.pure_damage == 12500
    assert analytics.defense.armor > 0
    assert analytics.defense.physical_reduction_pct > 0
    assert analytics.defense.magic_resistance_pct == 25.0


def test_damage_analytics_pure_caster():
    player = PlayerData(hero_damage=20000)
    hero = HeroData(name="npc_dota_hero_shredder", level=12)
    abilities = {
        "ability0": AbilityData(name="shredder_whirling_death", level=4),
        "ability1": AbilityData(name="shredder_timber_chain", level=4),
        "ability2": AbilityData(name="shredder_chakram", level=2),
    }
    items = {
        "slot0": ItemData(name="item_pipe"),
        "slot1": ItemData(name="item_shivas_guard"),
    }
    analytics = compute_damage_analytics(player, hero, abilities, items, clock_time=900)

    assert analytics.breakdown.pure_pct > 30.0
    assert analytics.defense.magic_resistance_pct > 25.0
    assert analytics.defense.armor > 15.0


def test_item_recommendations_progression():
    player = PlayerData(gold=2500, gpm=600)
    hero = HeroData(name="npc_dota_hero_antimage", level=10)
    # Player only has Power Treads and Battle Fury
    items = {
        "slot0": ItemData(name="item_power_treads"),
        "slot1": ItemData(name="item_bfury"),
    }
    rec = compute_item_recommendations(player, hero, items, gold_surplus=1500, clock_time=900)

    # Next item should be Manta Style
    assert rec.next_core_item is not None
    assert rec.next_core_item.item_id == "item_manta"
    assert rec.next_core_item.cost == 4550
    assert rec.next_core_item.remaining_gold == 4550 - 2500
    assert rec.next_core_item.progress_pct > 50.0
    assert rec.next_core_item.eta_seconds > 0
    assert len(rec.situational_items) > 0


def test_item_recommendations_late_game():
    player = PlayerData(gold=5000, gpm=750)
    hero = HeroData(name="npc_dota_hero_antimage", level=25)
    # Player already owns full build up to Abyssal
    items = {
        "slot0": ItemData(name="item_power_treads"),
        "slot1": ItemData(name="item_bfury"),
        "slot2": ItemData(name="item_manta"),
        "slot3": ItemData(name="item_black_king_bar"),
        "slot4": ItemData(name="item_butterfly"),
        "slot5": ItemData(name="item_abyssal_blade"),
    }
    rec = compute_item_recommendations(player, hero, items, gold_surplus=3000, clock_time=2400)

    # Next item should be Skadi
    assert rec.next_core_item is not None
    assert rec.next_core_item.item_id == "item_skadi"
