"""Post-match coaching derived exclusively from first-party GSI telemetry."""
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class MatchSnapshot:
    clock_time: int
    last_hits: int
    net_worth: int
    gpm: int
    xpm: int
    hero_damage: int
    deaths: int


@dataclass
class MatchJournal:
    match_id: Optional[str] = None
    snapshots: List[MatchSnapshot] = field(default_factory=list)
    death_count: int = 0
    _was_alive: bool = True
    _last_bucket: int = -1

    def reset(self, match_id: Optional[str]) -> None:
        self.match_id = match_id
        self.snapshots.clear()
        self.death_count = 0
        self._was_alive = True
        self._last_bucket = -1

    def record(self, *, match_id: Optional[str], clock_time: int, last_hits: int, net_worth: int,
               gpm: int, xpm: int, hero_damage: int, deaths: int, alive: bool) -> None:
        if self.match_id != match_id:
            self.reset(match_id)
        if self._was_alive and not alive and clock_time > 0:
            self.death_count += 1
        self._was_alive = alive
        bucket = max(0, clock_time) // 30
        if bucket != self._last_bucket:
            self.snapshots.append(MatchSnapshot(clock_time, last_hits, net_worth, gpm, xpm, hero_damage, deaths))
            self._last_bucket = bucket


def _insight(code: str, value: int = 0, severity: str = "info") -> Dict[str, object]:
    return {"code": code, "value": value, "severity": severity}


def build_match_review(journal: MatchJournal, *, clock_time: int, gpm: int, xpm: int, dpm: float,
                       last_hits: int, net_worth: int, deaths: int, buyback_ready: bool) -> Dict[str, object]:
    """Use transparent benchmarks; never infer enemy or fog-of-war information."""
    minutes = max(1, clock_time // 60)
    actual_deaths = max(deaths, journal.death_count)
    strengths: List[Dict[str, object]] = []
    focus: List[Dict[str, object]] = []
    score = 55

    if gpm >= 600:
        score += 12; strengths.append(_insight("farm_strong", gpm, "positive"))
    elif gpm < 430 and minutes >= 12:
        score -= 10; focus.append(_insight("farm_behind", gpm, "warning"))
    if xpm >= 600:
        score += 8; strengths.append(_insight("xp_strong", xpm, "positive"))
    elif xpm < 420 and minutes >= 12:
        score -= 6; focus.append(_insight("xp_behind", xpm, "warning"))
    if dpm >= 550:
        score += 10; strengths.append(_insight("fight_impact", round(dpm), "positive"))
    elif dpm < 300 and minutes >= 18:
        score -= 8; focus.append(_insight("fight_low_impact", round(dpm), "warning"))
    if actual_deaths <= max(2, minutes // 12):
        score += 7; strengths.append(_insight("deaths_disciplined", actual_deaths, "positive"))
    elif actual_deaths >= 5:
        score -= min(15, actual_deaths * 2); focus.append(_insight("deaths_costly", actual_deaths, "critical"))
    if not buyback_ready and minutes >= 25:
        score -= 6; focus.append(_insight("buyback_risk", 0, "warning"))
    elif buyback_ready and minutes >= 25:
        strengths.append(_insight("buyback_ready", 0, "positive"))

    target_cs = {10: 55, 20: 140, 30: 240}.get(min(30, (minutes // 10) * 10), max(50, minutes * 8))
    if minutes >= 10 and last_hits < target_cs * .75:
        focus.append(_insight("lane_cs_gap", target_cs - last_hits, "warning"))
    elif minutes >= 10:
        strengths.append(_insight("cs_on_track", last_hits, "positive"))

    if not strengths:
        strengths.append(_insight("steady_game", 0, "positive"))
    if not focus:
        focus.append(_insight("next_focus_objectives", 0, "info"))

    phase_rows = []
    for label, start, end, benchmark in (("laning", 0, 600, 55), ("midgame", 600, 1200, 140), ("late", 1200, 999999, 240)):
        phase = [s for s in journal.snapshots if start <= s.clock_time < end]
        if phase:
            last = phase[-1]
            phase_rows.append({"phase": label, "last_hits": last.last_hits, "net_worth": last.net_worth,
                               "gpm": last.gpm, "grade": "good" if last.last_hits >= benchmark * .8 else "needs_work"})

    return {"score": max(0, min(100, score)), "sample_count": len(journal.snapshots),
            "strengths": strengths[:3], "focus": sorted(focus, key=lambda item: {"critical": 0, "warning": 1, "info": 2}.get(str(item["severity"]), 3))[:3], "phases": phase_rows}
