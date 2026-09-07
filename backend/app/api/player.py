from fastapi import APIRouter
from app.models.player import PlayerMatch, PlayerProfileResponse, PlayerSummary, match_score
from app.services.opendota import opendota
router = APIRouter(prefix="/api/v1/player", tags=["Player history"])
def _takeaway(match: dict, won: bool) -> str:
    gpm, deaths, damage = int(match.get("gold_per_min") or 0), int(match.get("deaths") or 0), int(match.get("hero_damage") or 0)
    if deaths >= 8: return "Protect your life: deaths created too much downtime."
    if gpm < 380: return "Farm pace was the clearest opportunity."
    if damage < 12000 and int(match.get("duration") or 0) >= 1800: return "Look for safer fight participation."
    return "Solid personal tempo—repeat the habits that created it." if won else "Good signals despite the loss; review the next objective after fights."
@router.get("/{identity}", response_model=PlayerProfileResponse)
async def get_player_profile(identity: str):
    data = await opendota.profile(identity); profile, wl, heroes = data["profile"], data["wl"], data["heroes"]; wins, losses = int(wl.get("win") or 0), int(wl.get("lose") or 0); rows = []
    for match in data["matches"]:
        won = bool(match.get("player_slot", 0) < 128) == bool(match.get("radiant_win")); hero = heroes.get(str(match.get("hero_id")), {})
        rows.append(PlayerMatch(match_id=match["match_id"], started_at=int(match.get("start_time") or 0), hero_id=int(match.get("hero_id") or 0), hero_name=hero.get("localized_name") or f"Hero #{match.get('hero_id', '?')}", result="win" if won else "loss", duration=int(match.get("duration") or 0), kills=int(match.get("kills") or 0), deaths=int(match.get("deaths") or 0), assists=int(match.get("assists") or 0), gpm=int(match.get("gold_per_min") or 0), xpm=int(match.get("xp_per_min") or 0), hero_damage=int(match.get("hero_damage") or 0), tower_damage=int(match.get("tower_damage") or 0), last_hits=int(match.get("last_hits") or 0), performance_score=match_score(match), takeaway=_takeaway(match, won)))
    total = wins + losses
    return PlayerProfileResponse(player=PlayerSummary(account_id=data["account_id"], name=profile["profile"].get("personaname") or "Dota player", avatar=profile["profile"].get("avatarfull"), rank_tier=profile.get("rank_tier"), leaderboard_rank=profile.get("leaderboard_rank"), wins=wins, losses=losses, matches=total, win_rate=round(wins * 100 / total, 1) if total else 0), matches=rows)
