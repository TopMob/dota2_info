from typing import Optional, List
from app.models.gsi_models import PlayerData, HeroData
from app.models.state import FarmCoachAnalytics, FarmPacingGrade

# Baseline Immortal/Pro tier benchmarks per minute for Carry / Core heroes
# Format: minute -> (expected_cs, expected_net_worth, expected_gpm)
PRO_BENCHMARKS = [
    (5, 36, 2100, 420),
    (10, 78, 4600, 460),
    (15, 135, 7800, 520),
    (20, 205, 11800, 590),
    (25, 280, 16200, 650),
    (30, 360, 21500, 720),
    (40, 510, 31000, 780),
]


def _get_benchmark_targets(minutes: float) -> tuple[int, int, int]:
    if minutes <= 0:
        return (0, 600, 300)
    if minutes <= 5:
        ratio = minutes / 5.0
        return (int(36 * ratio), int(600 + 1500 * ratio), 420)
    elif minutes <= 10:
        ratio = (minutes - 5) / 5.0
        return (int(36 + (78 - 36) * ratio), int(2100 + (4600 - 2100) * ratio), 460)
    elif minutes <= 15:
        ratio = (minutes - 10) / 5.0
        return (int(78 + (135 - 78) * ratio), int(4600 + (7800 - 4600) * ratio), 520)
    elif minutes <= 20:
        ratio = (minutes - 15) / 5.0
        return (int(135 + (205 - 135) * ratio), int(7800 + (11800 - 7800) * ratio), 590)
    elif minutes <= 30:
        ratio = (minutes - 20) / 10.0
        return (int(205 + (360 - 205) * ratio), int(11800 + (21500 - 11800) * ratio), 720)
    else:
        ratio = (minutes - 30) / 10.0
        return (int(360 + (510 - 360) * ratio), int(21500 + (31000 - 21500) * ratio), 780)


def compute_farm_coach(
    player_data: Optional[PlayerData],
    hero_data: Optional[HeroData],
    clock_time: Optional[int],
) -> FarmCoachAnalytics:
    last_hits = player_data.last_hits or 0 if player_data else 0
    denies = player_data.denies or 0 if player_data else 0
    gpm = player_data.gpm or 0 if player_data else 0
    net_worth = player_data.net_worth or 0 if player_data else 0

    ct = max(0, clock_time or 0)
    minutes = ct / 60.0

    target_cs, target_nw, target_gpm = _get_benchmark_targets(minutes)
    cs_delta = last_hits - target_cs
    nw_delta = net_worth - target_nw

    # Calculate pacing grade
    if minutes < 2:
        grade = FarmPacingGrade.S
        efficiency_pct = 100.0
    else:
        perf_ratio = last_hits / max(1, target_cs)
        efficiency_pct = round(perf_ratio * 100.0, 1)
        if perf_ratio >= 1.15:
            grade = FarmPacingGrade.S_PLUS
        elif perf_ratio >= 0.95:
            grade = FarmPacingGrade.S
        elif perf_ratio >= 0.80:
            grade = FarmPacingGrade.A
        elif perf_ratio >= 0.65:
            grade = FarmPacingGrade.B
        else:
            grade = FarmPacingGrade.C

    # Generate Tactical Tips
    tips: List[str] = []
    if minutes < 10:
        if cs_delta >= 0:
            tips.append("Excellent laning CS pace. Focus on denying to maintain creep equilibrium.")
        else:
            tips.append(f"Falling behind by {abs(cs_delta)} CS. Pull small camp or request support trade.")
    elif minutes < 25:
        if gpm >= target_gpm:
            tips.append("High farming velocity. Push wave past river before clearing ancients.")
        else:
            tips.append("Farm pace slowed. Prioritize accelerated camp rotations between waves.")
    else:
        tips.append("Late game economy: maintain buyback buffer while securing outer jungle neutral camps.")

    # Stack timer awareness
    sec_in_min = ct % 60
    is_stack_window = 43 <= sec_in_min <= 55

    return FarmCoachAnalytics(
        grade=grade,
        efficiency_pct=min(150.0, efficiency_pct),
        target_cs=target_cs,
        cs_delta=cs_delta,
        target_net_worth=target_nw,
        net_worth_delta=nw_delta,
        is_stack_window=is_stack_window,
        stack_countdown_seconds=max(0, 53 - sec_in_min) if sec_in_min < 53 else 0,
        tactical_tips=tips,
    )
