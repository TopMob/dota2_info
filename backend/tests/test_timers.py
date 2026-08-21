import pytest
from app.engine.timer_engine import compute_active_timers
from app.models.state import UrgencyLevel

GAME_IN_PROGRESS = "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS"


def _find_timer(timers, timer_id):
    return next((t for t in timers if t.id == timer_id), None)


def test_water_runes_early_game():
    timers = compute_active_timers(110, GAME_IN_PROGRESS)
    water = _find_timer(timers, "water_rune")
    assert water is not None
    assert water.remaining_seconds == 10
    assert water.urgency == UrgencyLevel.CRITICAL_10S

    timers_late = compute_active_timers(300, GAME_IN_PROGRESS)
    assert _find_timer(timers_late, "water_rune") is None


def test_bounty_runes_cadence():
    timers = compute_active_timers(150, GAME_IN_PROGRESS)
    bounty = _find_timer(timers, "bounty_rune")
    assert bounty is not None
    assert bounty.next_event_time == 180
    assert bounty.remaining_seconds == 30
    assert bounty.urgency == UrgencyLevel.WARNING_30S


def test_wisdom_runes_cadence():
    timers = compute_active_timers(400, GAME_IN_PROGRESS)
    wisdom = _find_timer(timers, "wisdom_rune")
    assert wisdom is not None
    assert wisdom.next_event_time == 420
    assert wisdom.remaining_seconds == 20
    assert wisdom.urgency == UrgencyLevel.WARNING_30S


def test_neutral_tier_progression():
    timers_early = compute_active_timers(415, GAME_IN_PROGRESS)
    tier1 = _find_timer(timers_early, "neutral_tier_1")
    assert tier1 is not None
    assert tier1.remaining_seconds == 5
    assert tier1.urgency == UrgencyLevel.CRITICAL_10S

    timers_mid = compute_active_timers(720, GAME_IN_PROGRESS)
    tier2 = _find_timer(timers_mid, "neutral_tier_2")
    assert tier2 is not None
    assert tier2.next_event_time == 1020
    assert tier2.remaining_seconds == 300


def test_stack_timer_window():
    timers = compute_active_timers(168, GAME_IN_PROGRESS)
    stack = _find_timer(timers, "stack_pull")
    assert stack is not None
    assert stack.remaining_seconds == 5
    assert stack.urgency == UrgencyLevel.CRITICAL_10S
