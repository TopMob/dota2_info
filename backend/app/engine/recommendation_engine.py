from typing import Optional, Dict, List
from app.models.gsi_models import PlayerData, HeroData, ItemData
from app.models.state import ItemRecommendation, ItemPredictorAnalytics

# Item Metadata Dictionary
# format: name -> { display_name, cost, tags, reason }
ITEM_DATABASE = {
    "item_power_treads": {
        "display_name": "Power Treads",
        "cost": 1400,
        "tags": ["core", "stats", "attack_speed"],
        "reason": "Essential boots for stat-switching, attack speed and sustain.",
    },
    "item_phase_boots": {
        "display_name": "Phase Boots",
        "cost": 1500,
        "tags": ["core", "armor", "mobility"],
        "reason": "Mobility boost, attack damage and early armor for chasing.",
    },
    "item_tranquil_boots": {
        "display_name": "Tranquil Boots",
        "cost": 925,
        "tags": ["support", "regen", "mobility"],
        "reason": "High passive movement speed and HP regen for roaming.",
    },
    "item_arcane_boots": {
        "display_name": "Arcane Boots",
        "cost": 1300,
        "tags": ["support", "mana", "team"],
        "reason": "Team mana replenishment and building block for Guardian Greaves.",
    },
    "item_bfury": {
        "display_name": "Battle Fury",
        "cost": 4100,
        "tags": ["farming", "cleave", "damage"],
        "reason": "Primary farming engine. Multiplies creep clearance and jungle farm speed.",
    },
    "item_maelstrom": {
        "display_name": "Maelstrom",
        "cost": 2700,
        "tags": ["farming", "magic_procs", "wave_clear"],
        "reason": "Cost-effective farming accelerator with chain lightning magic procs.",
    },
    "item_mjollnir": {
        "display_name": "Mjollnir",
        "cost": 5500,
        "tags": ["attack_speed", "aoe", "shield"],
        "reason": "Maximum attack speed and static shield against high attack rate enemies.",
    },
    "item_manta": {
        "display_name": "Manta Style",
        "cost": 4550,
        "tags": ["dispel", "split_push", "stats"],
        "reason": "Basic dispel against silences/roots + illusions for scouting and DPS.",
    },
    "item_black_king_bar": {
        "display_name": "Black King Bar",
        "cost": 4050,
        "tags": ["spell_immunity", "magic_resist", "teamfight"],
        "reason": "Debuff immunity and 50% magic resist. Mandatory for uninterrupted teamfights.",
    },
    "item_abyssal_blade": {
        "display_name": "Abyssal Blade",
        "cost": 6250,
        "tags": ["lockdown", "bkb_pierce", "stun"],
        "reason": "Instant BKB-piercing melee stun to lock down slippery priority targets.",
    },
    "item_butterfly": {
        "display_name": "Butterfly",
        "cost": 4975,
        "tags": ["evasion", "agility", "attack_speed"],
        "reason": "High evasion (35%) and supreme agility/DPS scaling against physical right-clickers.",
    },
    "item_skadi": {
        "display_name": "Eye of Skadi",
        "cost": 5300,
        "tags": ["anti_heal", "slow", "all_stats"],
        "reason": "40% heal/regen reduction and heavy movement/attack speed slow.",
    },
    "item_monkey_king_bar": {
        "display_name": "Monkey King Bar",
        "cost": 4900,
        "tags": ["true_strike", "counter_evasion", "magic_damage"],
        "reason": "80% True Strike to counter enemy Butterfly, Radiance, and PA blur.",
    },
    "item_nullifier": {
        "display_name": "Nullifier",
        "cost": 4375,
        "tags": ["continuous_dispel", "counter_saves", "damage"],
        "reason": "Continuous dispel counters Ghost Scepter, Force Staff, Glimmer, and Aeon Disk.",
    },
    "item_satanic": {
        "display_name": "Satanic",
        "cost": 5050,
        "tags": ["lifesteal", "dispel", "hp_survivability"],
        "reason": "200% unholy lifesteal burst and instant self-dispel on cast.",
    },
    "item_blink": {
        "display_name": "Blink Dagger",
        "cost": 2250,
        "tags": ["initiation", "mobility", "positioning"],
        "reason": "Instant 1200-range positional displacement for initiation or escape.",
    },
    "item_blade_mail": {
        "display_name": "Blade Mail",
        "cost": 2100,
        "tags": ["damage_return", "armor", "counter_burst"],
        "reason": "Returns 105% damage to attackers. Great synergy with taunts and against burst.",
    },
    "item_heart": {
        "display_name": "Heart of Tarrasque",
        "cost": 5200,
        "tags": ["max_hp", "health_regen", "tank"],
        "reason": "Massive HP pool expansion and rapid out-of-combat regeneration.",
    },
    "item_shivas_guard": {
        "display_name": "Shiva's Guard",
        "cost": 4825,
        "tags": ["armor", "anti_heal", "aoe_slow"],
        "reason": "Arctic blast slows, grants 15 armor, and reduces enemy healing by 25%.",
    },
    "item_assault": {
        "display_name": "Assault Cuirass",
        "cost": 5125,
        "tags": ["armor_aura", "attack_speed", "pushing"],
        "reason": "Positive armor & attack speed aura for allies; negative armor for enemy towers.",
    },
    "item_glimmer_cape": {
        "display_name": "Glimmer Cape",
        "cost": 2150,
        "tags": ["magic_barrier", "invisibility", "save"],
        "reason": "300 HP magic damage barrier + invisibility to protect yourself or allies.",
    },
    "item_force_staff": {
        "display_name": "Force Staff",
        "cost": 2200,
        "tags": ["repositioning", "save", "mobility"],
        "reason": "Forces unit 600 units forward. Breaks cogs, pounce, riki smoke, and roots.",
    },
    "item_lotus_orb": {
        "display_name": "Lotus Orb",
        "cost": 3850,
        "tags": ["targeted_dispel", "spell_reflection", "armor"],
        "reason": "Echo shell reflects targeted single spells and applies instant basic dispel.",
    },
    "item_pipe": {
        "display_name": "Pipe of Insight",
        "cost": 3375,
        "tags": ["magic_shield", "magic_resist_aura", "team_defense"],
        "reason": "450 magic damage team barrier to negate heavy magical burst combos.",
    },
    "item_diffusal_blade": {
        "display_name": "Diffusal Blade",
        "cost": 2500,
        "tags": ["mana_burn", "slow", "agility"],
        "reason": "Burns 40 mana per hit and slows target movement to 0.",
    },
    "item_disperser": {
        "display_name": "Disperser",
        "cost": 5700,
        "tags": ["aoe_haste", "dispel", "mana_burn"],
        "reason": "Unslowable haste active for self/allies + dispel + amplified mana burn.",
    },
    "item_desolator": {
        "display_name": "Desolator",
        "cost": 3500,
        "tags": ["armor_reduction", "burst_damage", "structure_push"],
        "reason": "Reduces target armor by 6 and gains permanent damage stacks on kills.",
    },
    "item_greater_crit": {
        "display_name": "Daedalus",
        "cost": 5100,
        "tags": ["critical_strike", "raw_damage", "multiplier"],
        "reason": "30% chance for 225% critical strike to exponentially scale physical DPS.",
    },
    "item_scythe_of_vyse": {
        "display_name": "Scythe of Vyse",
        "cost": 5500,
        "tags": ["hex", "hard_disable", "mana_regen"],
        "reason": "2.8s instant Hex. Silences, mutes, and disarms without projectile travel time.",
    },
    "item_orchid": {
        "display_name": "Orchid Malevolence",
        "cost": 3475,
        "tags": ["silence", "mana_regen", "amplification"],
        "reason": "5-second silence + 30% accumulated damage pop at the end.",
    },
    "item_bloodthorn": {
        "display_name": "Bloodthorn",
        "cost": 6800,
        "tags": ["silence", "true_strike", "crit_procs"],
        "reason": "Target takes 60 magic dmg per hit + true strike and guaranteed crits for all allies.",
    },
    "item_aghanims_shard": {
        "display_name": "Aghanim's Shard",
        "cost": 1400,
        "tags": ["ability_upgrade", "utility", "shard"],
        "reason": "Hero specific spell upgrade / new sub-ability available after 15:00.",
    },
    "item_ultimate_scepter": {
        "display_name": "Aghanim's Scepter",
        "cost": 4200,
        "tags": ["ultimate_upgrade", "all_stats", "scepter"],
        "reason": "Empowers hero ultimate or unlocks unique 5th signature ability.",
    },
    "item_wind_waker": {
        "display_name": "Wind Waker",
        "cost": 6825,
        "tags": ["cyclone", "mobile_save", "dispel"],
        "reason": "Moveable cyclone invulnerability for self or allies to dodge lethal damage.",
    },
    "item_aeon_disk": {
        "display_name": "Aeon Disk",
        "cost": 3000,
        "tags": ["combo_breaker", "strong_dispel", "invulnerability"],
        "reason": "Triggers at <70% HP: strong dispel + 100% damage reduction for 2.5s.",
    },
}

# Hero build sequence graphs (Standard Meta Core Paths)
HERO_ITEM_BUILDS: Dict[str, List[str]] = {
    "npc_dota_hero_antimage": [
        "item_power_treads",
        "item_bfury",
        "item_manta",
        "item_black_king_bar",
        "item_butterfly",
        "item_abyssal_blade",
        "item_skadi",
    ],
    "npc_dota_hero_phantom_assassin": [
        "item_power_treads",
        "item_desolator",
        "item_black_king_bar",
        "item_nullifier",
        "item_satanic",
        "item_abyssal_blade",
    ],
    "npc_dota_hero_juggernaut": [
        "item_phase_boots",
        "item_bfury",
        "item_manta",
        "item_butterfly",
        "item_skadi",
        "item_nullifier",
    ],
    "npc_dota_hero_lion": [
        "item_tranquil_boots",
        "item_blink",
        "item_force_staff",
        "item_glimmer_cape",
        "item_aghanims_shard",
        "item_ultimate_scepter",
        "item_wind_waker",
    ],
    "npc_dota_hero_axe": [
        "item_phase_boots",
        "item_blink",
        "item_blade_mail",
        "item_black_king_bar",
        "item_heart",
        "item_shivas_guard",
    ],
    "npc_dota_hero_invoker": [
        "item_power_treads",
        "item_blink",
        "item_black_king_bar",
        "item_shivas_guard",
        "item_scythe_of_vyse",
        "item_wind_waker",
    ],
    "npc_dota_hero_pudge": [
        "item_phase_boots",
        "item_blink",
        "item_aghanims_shard",
        "item_heart",
        "item_shivas_guard",
        "item_black_king_bar",
    ],
    "npc_dota_hero_zuus": [
        "item_arcane_boots",
        "item_blink",
        "item_aghanims_shard",
        "item_ultimate_scepter",
        "item_wind_waker",
        "item_refresher",
    ],
    "npc_dota_hero_drow_ranger": [
        "item_power_treads",
        "item_manta",
        "item_black_king_bar",
        "item_butterfly",
        "item_satanic",
        "item_greater_crit",
    ],
}

# Generic fallback archetype builds
DEFAULT_CORE_BUILD = [
    "item_power_treads",
    "item_manta",
    "item_black_king_bar",
    "item_skadi",
    "item_butterfly",
    "item_satanic",
]

# Upgrade mappings (if player has upgraded version, base is considered owned)
UPGRADE_MAPPINGS = {
    "item_mjollnir": ["item_maelstrom"],
    "item_gleipnir": ["item_maelstrom"],
    "item_disperser": ["item_diffusal_blade"],
    "item_abyssal_blade": ["item_basher"],
    "item_wind_waker": ["item_cyclone"],
    "item_bloodthorn": ["item_orchid"],
}


def _get_owned_item_names(items: Optional[Dict[str, ItemData]]) -> set:
    if not items:
        return set()
    owned = set()
    for slot_name, item in items.items():
        if item and item.name and item.name != "empty":
            base_name = item.name
            owned.add(base_name)
            # Add reverse upgrades if any
            for upgraded, components in UPGRADE_MAPPINGS.items():
                if base_name == upgraded:
                    for comp in components:
                        owned.add(comp)
    return owned


def _format_eta(seconds: int) -> str:
    if seconds <= 0:
        return "Ready to buy"
    minutes = seconds // 60
    secs = seconds % 60
    if minutes > 0:
        return f"~{minutes}m {secs:02d}s"
    return f"~{secs}s"


def compute_item_recommendations(
    player_data: Optional[PlayerData],
    hero_data: Optional[HeroData],
    items: Optional[Dict[str, ItemData]],
    gold_surplus: int,
    clock_time: Optional[int],
) -> ItemPredictorAnalytics:
    gold = player_data.gold if player_data and player_data.gold else 0
    gpm = player_data.gpm if player_data and player_data.gpm else 0
    hero_name = hero_data.name if hero_data else ""
    owned_items = _get_owned_item_names(items)

    build_list = HERO_ITEM_BUILDS.get(hero_name, DEFAULT_CORE_BUILD)

    # 1. Find next primary core item
    target_item_key = "item_black_king_bar"
    for item_key in build_list:
        if item_key not in owned_items:
            target_item_key = item_key
            break

    item_info = ITEM_DATABASE.get(target_item_key, {
        "display_name": target_item_key.replace("item_", "").replace("_", " ").title(),
        "cost": 4000,
        "tags": ["core"],
        "reason": "Key power spike artifact for your hero's item progression.",
    })

    cost = item_info["cost"]
    remaining_gold = max(0, cost - gold)
    progress_pct = min(100.0, round((gold / max(1, cost)) * 100.0, 1))

    eta_seconds = 0
    if remaining_gold > 0 and gpm > 0:
        gold_per_sec = gpm / 60.0
        eta_seconds = int(remaining_gold / gold_per_sec)

    primary_rec = ItemRecommendation(
        item_id=target_item_key,
        display_name=item_info["display_name"],
        cost=cost,
        remaining_gold=remaining_gold,
        progress_pct=progress_pct,
        eta_seconds=eta_seconds,
        eta_formatted=_format_eta(eta_seconds),
        is_safe_with_buyback=gold_surplus >= remaining_gold,
        reason=item_info["reason"],
        tags=item_info["tags"],
        is_situational=False,
    )

    # 2. Compute situational alternatives
    situational_candidates = []
    # If BKB isn't primary, always offer BKB / Manta as defensive situational
    if target_item_key != "item_black_king_bar" and "item_black_king_bar" not in owned_items:
        situational_candidates.append("item_black_king_bar")

    if target_item_key != "item_nullifier" and "item_nullifier" not in owned_items:
        situational_candidates.append("item_nullifier")

    if target_item_key != "item_monkey_king_bar" and "item_monkey_king_bar" not in owned_items:
        situational_candidates.append("item_monkey_king_bar")

    if target_item_key != "item_skadi" and "item_skadi" not in owned_items:
        situational_candidates.append("item_skadi")

    if target_item_key != "item_abyssal_blade" and "item_abyssal_blade" not in owned_items:
        situational_candidates.append("item_abyssal_blade")

    situational_recs = []
    for alt_key in situational_candidates[:2]:
        alt_info = ITEM_DATABASE.get(alt_key)
        if not alt_info:
            continue
        alt_cost = alt_info["cost"]
        alt_remaining = max(0, alt_cost - gold)
        alt_progress = min(100.0, round((gold / max(1, alt_cost)) * 100.0, 1))
        alt_eta = 0
        if alt_remaining > 0 and gpm > 0:
            alt_eta = int(alt_remaining / (gpm / 60.0))

        situational_recs.append(ItemRecommendation(
            item_id=alt_key,
            display_name=alt_info["display_name"],
            cost=alt_cost,
            remaining_gold=alt_remaining,
            progress_pct=alt_progress,
            eta_seconds=alt_eta,
            eta_formatted=_format_eta(alt_eta),
            is_safe_with_buyback=gold_surplus >= alt_remaining,
            reason=alt_info["reason"],
            tags=alt_info["tags"],
            is_situational=True,
        ))

    # Determine game phase
    ct = clock_time or 0
    if ct < 12 * 60:
        stage = "Early Game / Laning"
    elif ct < 25 * 60:
        stage = "Mid Game / Core Timings"
    elif ct < 40 * 60:
        stage = "Late Game / Highground Sieges"
    else:
        stage = "Ultra Late / Game Ending"

    return ItemPredictorAnalytics(
        game_stage=stage,
        next_core_item=primary_rec,
        situational_items=situational_recs,
    )
