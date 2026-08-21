from typing import Optional
from app.models.gsi_models import HeroData, PlayerData
from app.models.state import TormentorAnalytics, TormentorStatus

TORMENTOR_FIRST_SPAWN = 20 * 60 # 1200 seconds (20:00)
SHARD_SHOP_UNLOCK = 15 * 60 # 900 seconds (15:00)


def compute_tormentor_analytics(
    hero_data: Optional[HeroData],
    player_data: Optional[PlayerData],
    clock_time: Optional[int],
) -> TormentorAnalytics:
    ct = max(0, clock_time or 0)
    has_shard = hero_data.aghanims_shard if hero_data else False
    gold = player_data.gold if player_data else 0

    if ct < TORMENTOR_FIRST_SPAWN:
        status = TormentorStatus.NOT_SPAWNED
        remaining_seconds = TORMENTOR_FIRST_SPAWN - ct
    else:
        status = TormentorStatus.ALIVE
        remaining_seconds = 0

    # Shard recommendation logic
    if has_shard:
        shard_advice = "Aghanim's Shard is active. Tormentor provides +280 team gold & 280 XP to allies."
        should_buy_from_shop = False
    elif ct < SHARD_SHOP_UNLOCK:
        mins_left = (SHARD_SHOP_UNLOCK - ct) // 60
        shard_advice = f"Shard unlocks in Shop in {mins_left}m (15:00). Tormentor arrives at 20:00."
        should_buy_from_shop = False
    elif ct < 18 * 60:
        if gold >= 1400:
            shard_advice = "Shard unlocked (1400g). Buy now if your hero depends on early shard spike."
            should_buy_from_shop = True
        else:
            shard_advice = f"Shard unlocked in Shop (1400g). Need {1400 - gold}g more."
            should_buy_from_shop = False
    elif ct < TORMENTOR_FIRST_SPAWN:
        shard_advice = "Hold gold! Tormentor spawns in under 2m (20:00). Group up for free shard."
        should_buy_from_shop = False
    else:
        shard_advice = "Tormentor is alive on map. Secure kill for free Aghanim's Shard."
        should_buy_from_shop = False

    return TormentorAnalytics(
        status=status,
        remaining_seconds=remaining_seconds,
        has_shard=has_shard,
        shard_advice=shard_advice,
        should_buy_from_shop=should_buy_from_shop,
    )
