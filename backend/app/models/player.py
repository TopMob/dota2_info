from typing import List, Optional
from pydantic import BaseModel

class PlayerSummary(BaseModel):
    account_id: int; name: str; avatar: Optional[str] = None; rank_tier: Optional[int] = None; leaderboard_rank: Optional[int] = None; wins: int; losses: int; matches: int; win_rate: float
class PlayerMatch(BaseModel):
    match_id: int; started_at: int; hero_id: int; hero_name: str; result: str; duration: int; kills: int; deaths: int; assists: int; gpm: int; xpm: int; hero_damage: int; tower_damage: int; last_hits: int; performance_score: int; takeaway: str
class PlayerProfileResponse(BaseModel):
    player: PlayerSummary; matches: List[PlayerMatch]; source: str = "OpenDota public match history"
def match_score(match: dict) -> int:
    deaths = max(1, int(match.get("deaths") or 0)); kda = (int(match.get("kills") or 0) + int(match.get("assists") or 0)) / deaths
    score = 40 + min(22, int(kda * 4)) + min(16, max(0, (int(match.get("gold_per_min") or 0) - 350) // 20)) + min(12, max(0, (int(match.get("xp_per_min") or 0) - 350) // 25))
    return max(0, min(100, score))
