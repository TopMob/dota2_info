from typing import List
from app.models.state import TacticalTimer, TimerCategory, UrgencyLevel


NEUTRAL_TIERS = [
    (1, 7 * 60, "Tier 1 Neutrals"),
    (2, 17 * 60, "Tier 2 Neutrals"),
    (3, 27 * 60, "Tier 3 Neutrals"),
    (4, 37 * 60, "Tier 4 Neutrals"),
    (5, 60 * 60, "Tier 5 Neutrals"),
]

WATER_RUNE_TIMES = [2 * 60, 4 * 60]
BOUNTY_INTERVAL = 180
POWERUP_INTERVAL = 120
POWERUP_START = 6 * 60
WISDOM_INTERVAL = 420
LOTUS_INTERVAL = 180
TORMENTOR_FIRST_SPAWN = 20 * 60
DAY_NIGHT_CYCLE = 300
STACK_WINDOW_END = 53
STACK_ALERT_THRESHOLD = 25


def _compute_urgency(remaining_sec: int) -> UrgencyLevel:
    if remaining_sec <= 0:
        return UrgencyLevel.ACTIVE
    if remaining_sec <= 10:
        return UrgencyLevel.CRITICAL_10S
    if remaining_sec <= 30:
        return UrgencyLevel.WARNING_30S
    return UrgencyLevel.NORMAL


def _next_recurring_event(clock_time: int, interval: int) -> int:
    return ((clock_time // interval) + 1) * interval


def compute_active_timers(clock_time: int, game_state: str) -> List[TacticalTimer]:
    if clock_time is None:
        return []

    timers: List[TacticalTimer] = []

    if clock_time < WATER_RUNE_TIMES[-1]:
        next_water = next(t for t in WATER_RUNE_TIMES if t > clock_time)
        remaining = next_water - clock_time
        timers.append(TacticalTimer(
            id="water_rune",
            category=TimerCategory.WATER_RUNE,
            name="Water Runes",
            remaining_seconds=remaining,
            next_event_time=next_water,
            urgency=_compute_urgency(remaining),
            icon="water",
            description="Mid lane river rune (2:00 / 4:00)",
        ))

    next_bounty = _next_recurring_event(clock_time, BOUNTY_INTERVAL) if clock_time >= 0 else 0
    bounty_remaining = next_bounty - clock_time
    timers.append(TacticalTimer(
        id="bounty_rune",
        category=TimerCategory.BOUNTY_RUNE,
        name="Bounty Runes",
        remaining_seconds=bounty_remaining,
        next_event_time=next_bounty,
        urgency=_compute_urgency(bounty_remaining),
        icon="bounty",
        description="Team gold every 3 minutes",
    ))

    if clock_time >= POWERUP_START:
        next_powerup = _next_recurring_event(clock_time, POWERUP_INTERVAL)
    else:
        next_powerup = POWERUP_START
    powerup_remaining = next_powerup - clock_time
    timers.append(TacticalTimer(
        id="powerup_rune",
        category=TimerCategory.POWERUP_RUNE,
        name="Power Rune",
        remaining_seconds=powerup_remaining,
        next_event_time=next_powerup,
        urgency=_compute_urgency(powerup_remaining),
        icon="powerup",
        description="Random river rune (DD, Haste, Invis, Illusion, Regen, Shield, Arcane)",
    ))

    next_wisdom = _next_recurring_event(clock_time, WISDOM_INTERVAL) if clock_time >= 0 else WISDOM_INTERVAL
    wisdom_remaining = next_wisdom - clock_time
    timers.append(TacticalTimer(
        id="wisdom_rune",
        category=TimerCategory.WISDOM_RUNE,
        name="Wisdom Rune",
        remaining_seconds=wisdom_remaining,
        next_event_time=next_wisdom,
        urgency=_compute_urgency(wisdom_remaining),
        icon="wisdom",
        description="Team XP at map edges (every 7 min)",
    ))

    next_lotus = _next_recurring_event(clock_time, LOTUS_INTERVAL) if clock_time >= 0 else LOTUS_INTERVAL
    lotus_remaining = next_lotus - clock_time
    timers.append(TacticalTimer(
        id="lotus_pool",
        category=TimerCategory.LOTUS_POOL,
        name="Lotus Pool",
        remaining_seconds=lotus_remaining,
        next_event_time=next_lotus,
        urgency=_compute_urgency(lotus_remaining),
        icon="lotus",
        description="Side lane lotus pool spawn",
    ))

    for tier_num, target_time, tier_name in NEUTRAL_TIERS:
        if clock_time < target_time:
            remaining = target_time - clock_time
            timers.append(TacticalTimer(
                id=f"neutral_tier_{tier_num}",
                category=TimerCategory.NEUTRAL_TIER,
                name=tier_name,
                remaining_seconds=remaining,
                next_event_time=target_time,
                urgency=_compute_urgency(remaining),
                icon="neutral",
                description=f"Neutral item tokens tier {tier_num} unlock",
            ))
            break

    if clock_time < TORMENTOR_FIRST_SPAWN:
        remaining_tormentor = TORMENTOR_FIRST_SPAWN - clock_time
        timers.append(TacticalTimer(
            id="tormentor_initial",
            category=TimerCategory.TORMENTOR,
            name="Tormentor",
            remaining_seconds=remaining_tormentor,
            next_event_time=TORMENTOR_FIRST_SPAWN,
            urgency=_compute_urgency(remaining_tormentor),
            icon="tormentor",
            description="First Tormentor spawn (Aghanim's Shard)",
        ))

    next_cycle = _next_recurring_event(clock_time, DAY_NIGHT_CYCLE) if clock_time >= 0 else 0
    cycle_remaining = next_cycle - clock_time
    is_day_now = (clock_time // DAY_NIGHT_CYCLE) % 2 == 0 if clock_time >= 0 else False
    timers.append(TacticalTimer(
        id="day_night_cycle",
        category=TimerCategory.DAY_NIGHT,
        name="Nightfall" if is_day_now else "Sunrise",
        remaining_seconds=cycle_remaining,
        next_event_time=next_cycle,
        urgency=_compute_urgency(cycle_remaining),
        icon="night" if is_day_now else "day",
        description="Vision and map visibility shift",
    ))

    if clock_time >= 0:
        minute_second = clock_time % 60
        if minute_second <= STACK_WINDOW_END:
            stack_target = (clock_time - minute_second) + STACK_WINDOW_END
            remaining_stack = stack_target - clock_time
            if remaining_stack <= STACK_ALERT_THRESHOLD:
                timers.append(TacticalTimer(
                    id="stack_pull",
                    category=TimerCategory.STACK_PULL,
                    name="Stack Window",
                    remaining_seconds=remaining_stack,
                    next_event_time=stack_target,
                    urgency=_compute_urgency(remaining_stack),
                    icon="stack",
                    description="Pull creeps at :53-:55 to stack camp",
                ))

    timers.sort(key=lambda t: t.remaining_seconds)
    return timers
