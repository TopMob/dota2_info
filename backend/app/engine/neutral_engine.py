from typing import Optional, Dict, List
from pydantic import BaseModel, ConfigDict
from app.models.gsi_models import HeroData, ItemData
from app.models.state import NeutralTierStatus, NeutralAdvisorAnalytics, NeutralItemSuggestion

# Neutral Tier Times in Clock Seconds
NEUTRAL_TIERS_SCHEDULE = [
    (1, 7 * 60, "Tier 1"),
    (2, 17 * 60, "Tier 2"),
    (3, 27 * 60, "Tier 3"),
    (4, 37 * 60, "Tier 4"),
    (5, 60 * 60, "Tier 5"),
]

# Neutral Items Catalog by Tier with Hero Synergies
NEUTRAL_ITEMS_CATALOG = {
    1: [
        {
            "id": "item_arcane_ring",
            "name": "Arcane Ring",
            "stat_bonus": "+8 Intelligence, +2 Armor",
            "ability": "Replenish: Restores 75 mana to all nearby allies (40s CD).",
            "archetypes": ["intelligence", "caster", "support", "mana_dependent"],
            "reason": "Solves early mana depletion for spell spammers and roaming supports.",
        },
        {
            "id": "item_duelist_gloves",
            "name": "Duelist Gloves",
            "stat_bonus": "+10 Attack Speed",
            "ability": "Boldness: Grants +15 bonus attack speed while an enemy hero is within 900 range.",
            "archetypes": ["agility", "carry", "strength", "right_click"],
            "reason": "Maximized attack speed bonus for lane trading and fast jungle camp clearing.",
        },
        {
            "id": "item_spark_of_courage",
            "name": "Spark of Courage",
            "stat_bonus": "+10 Damage / +5 Armor",
            "ability": "Courage: Grants +10 damage while >50% HP, or +5 armor while <50% HP.",
            "archetypes": ["strength", "carry", "agility", "tank"],
            "reason": "Dynamic scaling: accelerates early farming while providing clutch defensive armor.",
        },
        {
            "id": "item_seeds_of_serenity",
            "name": "Seeds of Serenity",
            "stat_bonus": "+150 Health",
            "ability": "Serenity: Grants +8 HP regen aura to nearby allies for 14 seconds.",
            "archetypes": ["support", "strength", "roamer"],
            "reason": "High flat HP pool boost plus AoE sustain for post-fight recovery and team pushes.",
        },
        {
            "id": "item_lance_of_pursuit",
            "name": "Lance of Pursuit",
            "stat_bonus": "+200 Mana",
            "ability": "Hound: Slows fleeing targets by 16% on rear attacks.",
            "archetypes": ["agility", "ganker", "carry"],
            "reason": "Essential chasing tool for securing kills on retreating offlaners and supports.",
        },
    ],
    2: [
        {
            "id": "item_vambrace",
            "name": "Vambrace",
            "stat_bonus": "+8 Primary Stat / +2 Secondary Stats",
            "ability": "Power Shift: Toggle stat focus (+6% Magic Resist, +8% Spell Amp, or +10 Attack Speed).",
            "archetypes": ["agility", "carry", "strength", "universal"],
            "reason": "Unmatched stat efficiency. Grants agility attack speed or strength survivability on demand.",
        },
        {
            "id": "item_specialists_array",
            "name": "Specialist's Array",
            "stat_bonus": "+8 All Attributes, +10 Damage",
            "ability": "Crackshot: Next attack fires secondary projectiles at 2 nearby enemy units.",
            "archetypes": ["agility", "ranged_carry", "right_click"],
            "reason": "Multi-target split attack dramatically boosts multi-creep farming and teamfight DPS.",
        },
        {
            "id": "item_philosophers_stone",
            "name": "Philosopher's Stone",
            "stat_bonus": "+200 Mana, -30 Attack Damage",
            "ability": "Gilded: Passively grants +75 Gold per minute.",
            "archetypes": ["support", "caster"],
            "reason": "Passive income engine for position 4/5 supports to fund Blink Dagger and Glimmer.",
        },
        {
            "id": "item_eye_of_the_vizier",
            "name": "Eye of the Vizier",
            "stat_bonus": "+125 Cast Range, +1.25 Mana Regen, -15% Max Mana",
            "ability": "Far Sight: Passive bonus cast range.",
            "archetypes": ["intelligence", "caster", "support"],
            "reason": "Safely initiates and saves teammates from outside the fog of war danger zone.",
        },
        {
            "id": "item_bullwhip",
            "name": "Bullwhip",
            "stat_bonus": "+90 Health, +3 Health Regen, +3 Mana Regen",
            "ability": "Whip: Speeds up ally by 18% or slows enemy by 18% (dispels slow).",
            "archetypes": ["support", "roamer", "universal"],
            "reason": "Dual-utility tool for rapid repositioning, slow cleansing, and gank execution.",
        },
    ],
    3: [
        {
            "id": "item_elven_tunic",
            "name": "Elven Tunic",
            "stat_bonus": "+16% Evasion, +7% Movement Speed, +26 Attack Speed",
            "archetypes": ["agility", "carry", "right_click"],
            "reason": "Triple-threat agility item: high evasion, movement haste, and DPS acceleration.",
        },
        {
            "id": "item_paladin_sword",
            "name": "Paladin Sword",
            "stat_bonus": "+16 Damage, +8% Lifesteal, +14% Heal/Lifesteal Amplification",
            "archetypes": ["carry", "strength", "sustain"],
            "reason": "Amplifies internal sustain, Satanic heals, and hero lifesteal abilities.",
        },
        {
            "id": "item_psychic_headband",
            "name": "Psychic Headband",
            "stat_bonus": "+12% Intelligence, +100 Cast Range",
            "ability": "Psychic Push: Pushes target enemy 400 units away (30s CD).",
            "archetypes": ["intelligence", "caster", "support"],
            "reason": "Self-peel against jumping melee carries plus extended spellcasting range.",
        },
        {
            "id": "item_nemesis_curse",
            "name": "Nemesis Curse",
            "stat_bonus": "+14 Damage",
            "ability": "Glassify: Target takes 7% increased magic damage and physical damage for 5s.",
            "archetypes": ["carry", "ganker", "universal"],
            "reason": "Universal damage amplification debuff to melt isolated targets in pickoffs.",
        },
    ],
    4: [
        {
            "id": "item_ninja_gear",
            "name": "Ninja Gear",
            "stat_bonus": "+24 Agility, +25 Movement Speed",
            "ability": "Solitary Camouflage: Casts permanent Smoke of Deceit on self (45s CD).",
            "archetypes": ["agility", "carry", "ganker"],
            "reason": "Free stealth gank and deep ward scouting without burning team smoke inventory.",
        },
        {
            "id": "item_timeless_relic",
            "name": "Timeless Relic",
            "stat_bonus": "+15% Spell Amplification, +20% Debuff Duration Amplification",
            "archetypes": ["intelligence", "caster", "initiator"],
            "reason": "Extends stuns and hexes while multiplying magic burst output.",
        },
        {
            "id": "item_telescope",
            "name": "Telescope",
            "stat_bonus": "+125 Cast Range, +125 Attack Range Aura",
            "archetypes": ["support", "ranged_carry", "caster"],
            "reason": "Global siege aura: enables teammates to breach highground towers from safety.",
        },
        {
            "id": "item_mind_breaker",
            "name": "Mind Breaker",
            "stat_bonus": "+25 Magic Damage per Hit, +15 Attack Speed, +20% Magic Resist",
            "ability": "Silence Strike: Next attack silences target for 2.0s (15s CD).",
            "archetypes": ["carry", "agility", "ganker"],
            "reason": "Free instant silence on hit to shut down escaping spellcasters instantly.",
        },
    ],
    5: [
        {
            "id": "item_mirror_shield",
            "name": "Mirror Shield",
            "stat_bonus": "+10 All Attributes",
            "ability": "Echo Reflex: Passively blocks and reflects targeted spells every 12s.",
            "archetypes": ["carry", "initiator", "strength", "agility"],
            "reason": "Passive Linken's Sphere + Lotus Orb reflection on a short 12s cooldown.",
        },
        {
            "id": "item_apex",
            "name": "Apex",
            "stat_bonus": "+70 Primary Attribute / +25 All Stats (Universal)",
            "archetypes": ["agility", "strength", "intelligence", "universal"],
            "reason": "Colossal stat surge: adds hundreds of damage, massive HP pool, or spell amp.",
        },
        {
            "id": "item_pirate_hat",
            "name": "Pirate Hat",
            "stat_bonus": "+150 Attack Speed, +20 Movement Speed",
            "ability": "Raid: Spawns Bounty Runes on hero kills.",
            "archetypes": ["carry", "right_click"],
            "reason": "Maximum possible attack speed in the game to shred through late game structures.",
        },
        {
            "id": "item_book_of_shadows",
            "name": "Book of Shadows",
            "stat_bonus": "+12 All Stats, +400 Vision",
            "ability": "Shadow Form: Target becomes untargetable, invulnerable, and muted for 3.5s.",
            "archetypes": ["support", "caster", "save"],
            "reason": "Ultimate emergency save: renders carry immune to lethal bursts and chronospheres.",
        },
    ],
}

HERO_ARCHETYPE_MAP = {
    "npc_dota_hero_antimage": ["agility", "carry", "right_click"],
    "npc_dota_hero_phantom_assassin": ["agility", "carry", "right_click"],
    "npc_dota_hero_juggernaut": ["agility", "carry", "right_click"],
    "npc_dota_hero_drow_ranger": ["agility", "ranged_carry", "right_click"],
    "npc_dota_hero_sniper": ["agility", "ranged_carry", "right_click"],
    "npc_dota_hero_faceless_void": ["agility", "carry", "right_click"],
    "npc_dota_hero_lion": ["intelligence", "support", "caster"],
    "npc_dota_hero_lina": ["intelligence", "caster", "ranged_carry"],
    "npc_dota_hero_invoker": ["intelligence", "caster", "universal"],
    "npc_dota_hero_zuus": ["intelligence", "caster"],
    "npc_dota_hero_axe": ["strength", "initiator", "tank"],
    "npc_dota_hero_pudge": ["strength", "initiator", "ganker"],
    "npc_dota_hero_shredder": ["strength", "caster", "tank"],
    "npc_dota_hero_spectre": ["agility", "carry", "tank"],
}


def _get_active_tier_info(clock_time: int) -> tuple[int, int, str]:
    """Returns (current_tier, seconds_to_next_tier, next_tier_label)"""
    if clock_time < 7 * 60:
        return (0, 7 * 60 - clock_time, "Tier 1 (at 07:00)")
    elif clock_time < 17 * 60:
        return (1, 17 * 60 - clock_time, "Tier 2 (at 17:00)")
    elif clock_time < 27 * 60:
        return (2, 27 * 60 - clock_time, "Tier 3 (at 27:00)")
    elif clock_time < 37 * 60:
        return (3, 37 * 60 - clock_time, "Tier 4 (at 37:00)")
    elif clock_time < 60 * 60:
        return (4, 60 * 60 - clock_time, "Tier 5 (at 60:00)")
    else:
        return (5, 0, "Max Tier Reached")


def compute_neutral_advisor(
    hero_data: Optional[HeroData],
    items_data: Optional[Dict[str, ItemData]],
    clock_time: Optional[int],
) -> NeutralAdvisorAnalytics:
    ct = max(0, clock_time or 0)
    current_tier, seconds_to_next, next_tier_label = _get_active_tier_info(ct)

    target_tier = current_tier if current_tier > 0 else 1
    tier_items = NEUTRAL_ITEMS_CATALOG.get(target_tier, [])

    hero_name = hero_data.name if hero_data else ""
    hero_tags = set(HERO_ARCHETYPE_MAP.get(hero_name, ["agility", "carry", "universal"]))

    # Rank tier items by archetype overlap score
    scored_items = []
    for item in tier_items:
        item_archetypes = set(item.get("archetypes", []))
        overlap = len(hero_tags.intersection(item_archetypes))
        scored_items.append((overlap, item))

    scored_items.sort(key=lambda x: x[0], reverse=True)

    suggestions = []
    for rank, (_, item) in enumerate(scored_items[:3], start=1):
        suggestions.append(NeutralItemSuggestion(
            item_id=item["id"],
            name=item["name"],
            tier=target_tier,
            rank=rank,
            stat_bonus=item["stat_bonus"],
            ability=item.get("ability", ""),
            synergy_reason=item["reason"],
        ))

    # Check equipped neutral
    equipped_neutral_name = "Empty"
    if items_data and "neutral0" in items_data:
        n_slot = items_data["neutral0"]
        if n_slot and n_slot.name and n_slot.name != "empty":
            clean = n_slot.name.replace("item_", "").replace("_", " ").title()
            equipped_neutral_name = clean

    tier_statuses = []
    for t_num, t_time, t_name in NEUTRAL_TIERS_SCHEDULE:
        is_active = ct >= t_time
        tier_statuses.append(NeutralTierStatus(
            tier=t_num,
            name=t_name,
            unlock_clock=t_time,
            is_unlocked=is_active,
            seconds_remaining=max(0, t_time - ct),
        ))

    return NeutralAdvisorAnalytics(
        current_tier=current_tier,
        target_tier=target_tier,
        seconds_to_next_tier=seconds_to_next,
        next_tier_formatted=next_tier_label,
        equipped_item_name=equipped_neutral_name,
        has_neutral_equipped=equipped_neutral_name != "Empty",
        tier_statuses=tier_statuses,
        top_suggestions=suggestions,
    )
