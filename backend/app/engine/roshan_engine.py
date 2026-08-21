from typing import Optional, List
from app.models.gsi_models import MapData
from app.models.state import RoshanAnalytics, RoshanStatus

AEGIS_DURATION = 300
MIN_RESPAWN_DELAY = 480
MAX_RESPAWN_DELAY = 660


class RoshanTracker:
    def __init__(self):
        self.death_count: int = 0
        self._last_known_state: Optional[str] = None
        self._last_death_clock_time: Optional[int] = None

    def compute(self, map_data: Optional[MapData]) -> RoshanAnalytics:
        if not map_data:
            return RoshanAnalytics()

        raw_state = (map_data.roshan_state or "alive").lower()
        state_end = map_data.roshan_state_end_seconds or 0
        clock_time = map_data.clock_time or 0

        if self._last_known_state == "alive" and raw_state in ("respawn_base", "respawn_variable"):
            self.death_count += 1
            self._last_death_clock_time = clock_time

        self._last_known_state = raw_state
        expected_drops = self._predict_drops(self.death_count + 1)

        if raw_state == "alive":
            return RoshanAnalytics(
                status=RoshanStatus.ALIVE,
                state_end_seconds=0,
                death_count=self.death_count,
                expected_drops=expected_drops,
            )

        if raw_state == "respawn_base":
            aegis_expires = self._offset(AEGIS_DURATION)
            min_respawn = self._offset(MIN_RESPAWN_DELAY)
            max_respawn = self._offset(MAX_RESPAWN_DELAY)
            is_aegis_active = aegis_expires is not None and clock_time < aegis_expires
            status = RoshanStatus.AEGIS_HELD if is_aegis_active else RoshanStatus.RESPAWN_WINDOW

            return RoshanAnalytics(
                status=status,
                state_end_seconds=state_end,
                death_clock_time=self._last_death_clock_time,
                aegis_expires_clock=aegis_expires,
                min_respawn_clock=min_respawn,
                max_respawn_clock=max_respawn,
                death_count=self.death_count,
                expected_drops=expected_drops,
            )

        if raw_state == "respawn_variable":
            return RoshanAnalytics(
                status=RoshanStatus.RESPAWN_GUARANTEED,
                state_end_seconds=state_end,
                death_clock_time=self._last_death_clock_time,
                min_respawn_clock=self._offset(MIN_RESPAWN_DELAY),
                max_respawn_clock=self._offset(MAX_RESPAWN_DELAY),
                death_count=self.death_count,
                expected_drops=expected_drops,
            )

        return RoshanAnalytics(
            status=RoshanStatus.UNKNOWN,
            state_end_seconds=state_end,
            death_count=self.death_count,
            expected_drops=expected_drops,
        )

    def _offset(self, seconds: int) -> Optional[int]:
        if self._last_death_clock_time is None:
            return None
        return self._last_death_clock_time + seconds

    @staticmethod
    def _predict_drops(next_kill_number: int) -> List[str]:
        drops = ["Aegis of the Immortal"]
        if next_kill_number >= 2:
            drops.append("Cheese")
        if next_kill_number >= 3:
            drops.append("Refresher Shard / Aghanim's Blessing")
        if next_kill_number >= 4:
            drops.append("Roshan's Banner")
        return drops


roshan_tracker = RoshanTracker()
