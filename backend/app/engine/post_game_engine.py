from typing import Optional, List
from app.models.state import PostGameDebrief, DamageAnalytics, EconomyAnalytics, HeroStatusInfo


def generate_post_game_debrief(
    match_id: Optional[str],
    clock_time: int,
    radiant_score: int,
    dire_score: int,
    hero: HeroStatusInfo,
    economy: EconomyAnalytics,
    damage: DamageAnalytics,
    review=None,
) -> PostGameDebrief:
    duration_mins = max(1, clock_time // 60)
    duration_str = f"{duration_mins}:{clock_time % 60:02d}"

    highlights: List[str] = []
    if economy.gpm >= 650:
        highlights.append(f"High-tier GPM ({economy.gpm}) - accelerated core item timings.")
    if damage.dpm >= 600:
        highlights.append(f"Devastating teamfight presence ({int(damage.dpm)} DPM).")
    if economy.cs_per_min >= 8.0:
        highlights.append(f"Outstanding last hit efficiency ({economy.cs_per_min} CS/min).")
    if not highlights:
        highlights.append("Stable performance across objectives and lane stages.")

    improvements: List[str] = []
    if economy.buyback_status != "READY":
        improvements.append("Buyback deficit was active during late game phases — prioritize gold surplus buffer.")
    if damage.dpm < 400:
        improvements.append("Damage output was conservative — look for active rotation angles and team skirmishes.")
    if not improvements:
        improvements.append("Consistent tactical play with minimal downtime.")

    # Compute overall performance score (0 - 100)
    score_acc = 70.0
    if economy.gpm >= 600:
        score_acc += 10.0
    if damage.dpm >= 500:
        score_acc += 10.0
    if economy.cs_per_min >= 7.0:
        score_acc += 10.0

    return PostGameDebrief(
        match_id=match_id or "Local Session",
        duration_formatted=duration_str,
        overall_score=min(100, int(score_acc)),
        radiant_score=radiant_score,
        dire_score=dire_score,
        total_hero_damage=damage.total_hero_damage,
        dpm=damage.dpm,
        gpm=economy.gpm,
        xpm=economy.xpm,
        net_worth=economy.net_worth,
        last_hits=economy.last_hits,
        denies=economy.denies,
        highlights=highlights,
        improvement_areas=improvements,
        review=review,
    )
