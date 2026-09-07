"""Public Dota match history client. Uses OpenDota only; no game-client access."""
import asyncio
import time
from typing import Any, Dict
import httpx
from fastapi import HTTPException

OPEN_DOTA = "https://api.opendota.com/api"
STEAM64_OFFSET = 76561197960265728

class OpenDotaClient:
    def __init__(self) -> None:
        self._cache: Dict[str, tuple[float, Any]] = {}
        self._lock = asyncio.Lock()

    @staticmethod
    def account_id(value: str) -> int:
        raw = value.strip().rstrip("/").split("/")[-1]
        if raw.isdigit():
            parsed = int(raw)
            return parsed - STEAM64_OFFSET if parsed > STEAM64_OFFSET else parsed
        raise HTTPException(422, "Enter a numeric Steam ID or a Steam profile URL ending in the numeric ID.")

    async def _get(self, path: str, ttl: int = 300) -> Any:
        cached = self._cache.get(path)
        if cached and cached[0] > time.monotonic(): return cached[1]
        async with self._lock:
            cached = self._cache.get(path)
            if cached and cached[0] > time.monotonic(): return cached[1]
            try:
                async with httpx.AsyncClient(timeout=12) as client:
                    response = await client.get(f"{OPEN_DOTA}{path}")
                if response.status_code == 404: raise HTTPException(404, "Profile was not found. Make Dota match history public and try again.")
                response.raise_for_status(); data = response.json()
            except HTTPException: raise
            except httpx.HTTPError as exc: raise HTTPException(503, "Match history is temporarily unavailable. Try again shortly.") from exc
            self._cache[path] = (time.monotonic() + ttl, data)
            return data

    async def profile(self, identity: str) -> Dict[str, Any]:
        account_id = self.account_id(identity)
        profile, wl, matches, heroes = await asyncio.gather(self._get(f"/players/{account_id}"), self._get(f"/players/{account_id}/wl"), self._get(f"/players/{account_id}/recentMatches?limit=20", 120), self._get("/constants/heroes", 86400))
        if not profile.get("profile"): raise HTTPException(404, "Profile was not found. Make Dota match history public and try again.")
        return {"account_id": account_id, "profile": profile, "wl": wl, "matches": matches, "heroes": heroes}

opendota = OpenDotaClient()
