from typing import Optional
from app.models.gsi_models import PlayerData, HeroData
from app.models.state import EconomyAnalytics, BuybackStatus


def compute_economy(
    player_data: Optional[PlayerData],
    hero_data: Optional[HeroData],
    clock_time: Optional[int],
) -> EconomyAnalytics:
    if not player_data:
        return EconomyAnalytics()

    gold = player_data.gold or 0
    gold_reliable = player_data.gold_reliable or 0
    gold_unreliable = player_data.gold_unreliable or 0
    net_worth = player_data.net_worth or 0
    gpm = player_data.gpm or 0
    xpm = player_data.xpm or 0
    last_hits = player_data.last_hits or 0
    denies = player_data.denies or 0

    cs_per_min = 0.0
    if clock_time and clock_time > 60:
        cs_per_min = round(last_hits / (clock_time / 60.0), 1)

    buyback_cost = hero_data.buyback_cost or 0 if hero_data else 0
    buyback_cooldown = hero_data.buyback_cooldown or 0 if hero_data else 0

    if buyback_cooldown > 0:
        status = BuybackStatus.COOLDOWN
    elif gold >= buyback_cost:
        status = BuybackStatus.READY
    else:
        status = BuybackStatus.NO_GOLD

    return EconomyAnalytics(
        gold=gold,
        gold_reliable=gold_reliable,
        gold_unreliable=gold_unreliable,
        net_worth=net_worth,
        gpm=gpm,
        xpm=xpm,
        last_hits=last_hits,
        denies=denies,
        cs_per_min=cs_per_min,
        buyback_cost=buyback_cost,
        buyback_cooldown=buyback_cooldown,
        buyback_status=status,
        gold_surplus=gold - buyback_cost,
        gold_deficit=max(0, buyback_cost - gold),
    )
