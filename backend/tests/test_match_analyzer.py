from app.engine.match_analyzer import MatchJournal, build_match_review


def test_review_flags_low_farm_and_costly_deaths():
    journal = MatchJournal()
    journal.record(match_id="1", clock_time=600, last_hits=30, net_worth=3500, gpm=380, xpm=390, hero_damage=1000, deaths=5, alive=True)
    review = build_match_review(journal, clock_time=1200, gpm=380, xpm=390, dpm=250, last_hits=75, net_worth=6500, deaths=5, buyback_ready=False)
    codes = {item["code"] for item in review["focus"]}
    assert review["score"] < 55
    assert "farm_behind" in codes
    assert "deaths_costly" in codes


def test_review_rewards_safe_high_tempo_game():
    journal = MatchJournal()
    journal.record(match_id="2", clock_time=599, last_hits=65, net_worth=7000, gpm=650, xpm=630, hero_damage=6000, deaths=1, alive=True)
    review = build_match_review(journal, clock_time=1200, gpm=650, xpm=630, dpm=600, last_hits=155, net_worth=14500, deaths=1, buyback_ready=True)
    assert review["score"] > 80
    assert review["phases"][0]["grade"] == "good"
