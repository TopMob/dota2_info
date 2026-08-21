import pytest
from app.models.gsi_models import PlayerData, HeroData, ItemData
from app.engine.neutral_engine import compute_neutral_advisor
from app.engine.farm_coach_engine import compute_farm_coach
from app.engine.tormentor_engine import compute_tormentor_analytics
from app.engine.post_game_engine import generate_post_game_debrief
from app.models.state import DamageAnalytics, EconomyAnalytics, HeroStatusInfo


def test_neutral_advisor_tier_schedule():
    hero = HeroData(name="npc_dota_hero_antimage")
    items = {"neutral0": ItemData(name="empty")}

    # Tier 1 (at 07:00 = 420s)
    advisor_early = compute_neutral_advisor(hero, items, clock_time=300)
    assert advisor_early.target_tier == 1
    assert advisor_early.seconds_to_next_tier == 120
    assert len(advisor_early.top_suggestions) > 0
    assert not advisor_early.has_neutral_equipped

    # Tier 2 (at 17:00 = 1020s, so 1050s has Tier 2 unlocked)
    advisor_t2 = compute_neutral_advisor(hero, items, clock_time=1050)
    assert advisor_t2.current_tier == 2
    assert advisor_t2.target_tier == 2


def test_farm_coach_grading():
    hero = HeroData(name="npc_dota_hero_antimage")

    # High performance: 95 CS at 10m (600s) -> S+ grade
    player_good = PlayerData(last_hits=95, gpm=580, net_worth=5400)
    coach_good = compute_farm_coach(player_good, hero, clock_time=600)
    assert coach_good.grade in ["S+", "S"]
    assert coach_good.cs_delta > 0
    assert len(coach_good.tactical_tips) > 0

    # Low performance: 20 CS at 10m -> C grade
    player_bad = PlayerData(last_hits=20, gpm=280, net_worth=2200)
    coach_bad = compute_farm_coach(player_bad, hero, clock_time=600)
    assert coach_bad.grade in ["C", "B"]
    assert coach_bad.cs_delta < 0


def test_tormentor_and_shard_advice():
    hero = HeroData(name="npc_dota_hero_antimage", aghanims_shard=False)
    player = PlayerData(gold=1800)

    # Before 15m
    tormentor_early = compute_tormentor_analytics(hero, player, clock_time=600)
    assert not tormentor_early.should_buy_from_shop

    # At 16m with 1800g
    tormentor_shop = compute_tormentor_analytics(hero, player, clock_time=960)
    assert tormentor_shop.should_buy_from_shop

    # Near 20m: advice changes to save gold
    tormentor_near_20 = compute_tormentor_analytics(hero, player, clock_time=1150)
    assert not tormentor_near_20.should_buy_from_shop
    assert "Hold gold" in tormentor_near_20.shard_advice


def test_post_game_debrief_generation():
    hero = HeroStatusInfo(hero_name="npc_dota_hero_antimage", hero_display_name="Anti-Mage")
    economy = EconomyAnalytics(gpm=680, xpm=720, net_worth=24000, last_hits=340, denies=15, cs_per_min=8.5)
    damage = DamageAnalytics(total_hero_damage=32000, dpm=800.0)

    debrief = generate_post_game_debrief(
        match_id="9988776655",
        clock_time=2400,
        radiant_score=35,
        dire_score=20,
        hero=hero,
        economy=economy,
        damage=damage,
    )

    assert debrief.match_id == "9988776655"
    assert debrief.overall_score >= 80
    assert len(debrief.highlights) > 0
