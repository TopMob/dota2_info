import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "is_connected_to_game" in data


@pytest.mark.asyncio
async def test_gsi_webhook_post():
    payload = {
        "map": {
            "matchid": "123456",
            "clock_time": 600,
            "game_state": "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS",
        },
        "player": {"gold": 1500, "net_worth": 6000},
        "hero": {"id": 1, "name": "npc_dota_hero_antimage", "buyback_cost": 500},
        "auth": {"token": "dota2_insight_secure_local_token"},
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/gsi", json=payload)
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_mock_simulation_controls():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        start_res = await client.post("/api/v1/mock/start", json={"speed": 5.0, "start_time": 0})
        assert start_res.status_code == 200
        assert start_res.json()["status"] == "started"

        status_res = await client.get("/api/v1/mock/status")
        assert status_res.status_code == 200
        assert status_res.json()["is_running"] is True

        stop_res = await client.post("/api/v1/mock/stop")
        assert stop_res.status_code == 200
        assert stop_res.json()["status"] == "stopped"
