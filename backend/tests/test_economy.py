import pytest
from app.engine.economy_engine import compute_economy
from app.models.gsi_models import PlayerData, HeroData
from app.models.state import BuybackStatus


def test_buyback_ready_with_surplus():
    player = PlayerData(gold=2000, last_hits=120, gpm=550)
    hero = HeroData(buyback_cost=800, buyback_cooldown=0)

    econ = compute_economy(player, hero, clock_time=1200)
    assert econ.buyback_status == BuybackStatus.READY
    assert econ.gold_surplus == 1200
    assert econ.gold_deficit == 0
    assert econ.cs_per_min == 6.0


def test_buyback_no_gold_deficit():
    player = PlayerData(gold=400, last_hits=80, gpm=400)
    hero = HeroData(buyback_cost=900, buyback_cooldown=0)

    econ = compute_economy(player, hero, clock_time=900)
    assert econ.buyback_status == BuybackStatus.NO_GOLD
    assert econ.gold_surplus == -500
    assert econ.gold_deficit == 500


def test_buyback_cooldown():
    player = PlayerData(gold=5000)
    hero = HeroData(buyback_cost=1000, buyback_cooldown=180)

    econ = compute_economy(player, hero, clock_time=1500)
    assert econ.buyback_status == BuybackStatus.COOLDOWN
    assert econ.buyback_cooldown == 180
