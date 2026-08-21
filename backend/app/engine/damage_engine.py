from typing import Optional, Dict, List, Tuple
from app.models.gsi_models import PlayerData, HeroData, ItemData, AbilityData
from app.models.state import DamageAnalytics, DamageBreakdown, DefenseMatrix

# Known ability damage affinities
# Format: (phys_weight, magic_weight, pure_weight)
ABILITY_DAMAGE_MAP: Dict[str, Tuple[float, float, float]] = {
    # Anti-Mage
    "antimage_mana_break": (0.2, 0.8, 0.0),
    "antimage_mana_void": (0.0, 1.0, 0.0),
    # Invoker
    "invoker_sun_strike": (0.0, 0.0, 1.0),
    "invoker_chaos_meteor": (0.0, 1.0, 0.0),
    "invoker_emp": (0.0, 0.0, 1.0),
    "invoker_deafening_blast": (0.0, 1.0, 0.0),
    "invoker_forge_spirit": (0.8, 0.2, 0.0),
    "invoker_cold_snap": (0.0, 1.0, 0.0),
    # Timbersaw
    "shredder_whirling_death": (0.0, 0.2, 0.8),
    "shredder_timber_chain": (0.0, 0.0, 1.0),
    "shredder_chakram": (0.0, 0.0, 1.0),
    # Lion
    "lion_impale": (0.0, 1.0, 0.0),
    "lion_finger_of_death": (0.0, 1.0, 0.0),
    "lion_mana_drain": (0.0, 1.0, 0.0),
    # Lina
    "lina_dragon_slave": (0.0, 1.0, 0.0),
    "lina_light_strike_array": (0.0, 1.0, 0.0),
    "lina_laguna_blade": (0.0, 0.5, 0.5),
    # Phantom Assassin
    "phantom_assassin_stifling_dagger": (0.9, 0.0, 0.1),
    "phantom_assassin_coup_de_grace": (1.0, 0.0, 0.0),
    # Juggernaut
    "juggernaut_blade_fury": (0.0, 1.0, 0.0),
    "juggernaut_omni_slash": (1.0, 0.0, 0.0),
    "juggernaut_swift_slash": (1.0, 0.0, 0.0),
    # Pudge
    "pudge_meat_hook": (0.0, 0.0, 1.0),
    "pudge_rot": (0.0, 1.0, 0.0),
    "pudge_dismember": (0.0, 1.0, 0.0),
    # Axe
    "axe_culling_blade": (0.0, 0.0, 1.0),
    "axe_counter_helix": (0.0, 0.0, 1.0),
    "axe_battle_hunger": (1.0, 0.0, 0.0),
    # Zeus
    "zuus_arc_lightning": (0.0, 1.0, 0.0),
    "zuus_lightning_bolt": (0.0, 1.0, 0.0),
    "zuus_static_field": (0.0, 1.0, 0.0),
    "zuus_thundergods_wrath": (0.0, 1.0, 0.0),
    # Queen of Pain
    "queenofpain_sonic_wave": (0.0, 0.0, 1.0),
    "queenofpain_shadow_strike": (0.0, 1.0, 0.0),
    "queenofpain_scream_of_pain": (0.0, 1.0, 0.0),
    # Silencer
    "silencer_glaives_of_wisdom": (0.0, 0.0, 1.0),
    # Spectre
    "spectre_desolate": (0.0, 0.0, 1.0),
    "spectre_dispersion": (0.4, 0.4, 0.2),
    # Tinker
    "tinker_laser": (0.0, 0.0, 1.0),
    # Muerta
    "muerta_dead_shot": (0.0, 1.0, 0.0),
    "muerta_the_calling": (0.0, 1.0, 0.0),
    "muerta_pierce_the_veil": (0.0, 1.0, 0.0),
    # Bristleback
    "bristleback_quill_spray": (1.0, 0.0, 0.0),
    "bristleback_viscous_nasal_goo": (1.0, 0.0, 0.0),
    # Leshrac
    "leshrac_split_earth": (0.0, 1.0, 0.0),
    "leshrac_diabolic_edict": (1.0, 0.0, 0.0),
    "leshrac_lightning_storm": (0.0, 1.0, 0.0),
    "leshrac_pulse_nova": (0.0, 1.0, 0.0),
    # Necrophos
    "necrolyte_death_pulse": (0.0, 1.0, 0.0),
    "necrolyte_heartstopper_aura": (0.0, 1.0, 0.0),
    "necrolyte_reapers_scythe": (0.0, 1.0, 0.0),
    # Sven
    "sven_storm_bolt": (0.0, 1.0, 0.0),
    "sven_gods_strength": (1.0, 0.0, 0.0),
    # Ursa
    "ursa_earthshock": (0.0, 1.0, 0.0),
    "ursa_fury_swipes": (1.0, 0.0, 0.0),
    # Mars
    "mars_spear": (0.0, 1.0, 0.0),
    "mars_gods_rebuke": (1.0, 0.0, 0.0),
    "mars_arena_of_blood": (0.0, 1.0, 0.0),
}

# Items that add specific damage types or bonuses
ITEM_DAMAGE_WEIGHTS: Dict[str, Tuple[float, float, float]] = {
    "item_radiance": (0.0, 1.0, 0.0),
    "item_maelstrom": (0.3, 0.7, 0.0),
    "item_mjollnir": (0.3, 0.7, 0.0),
    "item_gleipnir": (0.3, 0.7, 0.0),
    "item_diffusal_blade": (0.5, 0.5, 0.0),
    "item_disperser": (0.5, 0.5, 0.0),
    "item_dagon": (0.0, 1.0, 0.0),
    "item_dagon_2": (0.0, 1.0, 0.0),
    "item_dagon_3": (0.0, 1.0, 0.0),
    "item_dagon_4": (0.0, 1.0, 0.0),
    "item_dagon_5": (0.0, 1.0, 0.0),
    "item_monkey_king_bar": (0.4, 0.6, 0.0),
    "item_orchid": (0.2, 0.8, 0.0),
    "item_bloodthorn": (0.4, 0.6, 0.0),
    "item_meteor_hammer": (0.0, 1.0, 0.0),
    "item_shivas_guard": (0.0, 1.0, 0.0),
    "item_ethereal_blade": (0.0, 1.0, 0.0),
    "item_veil_of_discord": (0.0, 1.0, 0.0),
    "item_revenants_brooch": (0.0, 1.0, 0.0),
    "item_bfury": (1.0, 0.0, 0.0),
    "item_desolator": (1.0, 0.0, 0.0),
    "item_greater_crit": (1.0, 0.0, 0.0),
    "item_lesser_crit": (1.0, 0.0, 0.0),
    "item_butterfly": (1.0, 0.0, 0.0),
    "item_abyssal_blade": (0.8, 0.2, 0.0),
}

# Magic resist granting items
MAGIC_RESIST_ITEMS: Dict[str, float] = {
    "item_cloak": 0.15,
    "item_glimmer_cape": 0.25,
    "item_hood_of_defiance": 0.18,
    "item_pipe": 0.30,
    "item_eternal_shroud": 0.35,
    "item_mage_slayer": 0.25,
    "item_black_king_bar": 0.50,
}

# Armor granting items
ARMOR_ITEMS: Dict[str, float] = {
    "item_ring_of_protection": 2.0,
    "item_buckler": 2.0,
    "item_chainmail": 4.0,
    "item_platemail": 10.0,
    "item_shivas_guard": 15.0,
    "item_assault": 10.0,
    "item_blade_mail": 6.0,
    "item_lotus_orb": 10.0,
    "item_guardian_greaves": 3.0,
    "item_urn_of_shadows": 2.0,
    "item_spirit_vessel": 2.0,
}

HERO_BASE_PROFILES: Dict[str, Tuple[float, float, float]] = {
    "npc_dota_hero_antimage": (0.65, 0.35, 0.0),
    "npc_dota_hero_phantom_assassin": (0.95, 0.0, 0.05),
    "npc_dota_hero_juggernaut": (0.75, 0.25, 0.0),
    "npc_dota_hero_lion": (0.05, 0.95, 0.0),
    "npc_dota_hero_lina": (0.25, 0.60, 0.15),
    "npc_dota_hero_invoker": (0.15, 0.60, 0.25),
    "npc_dota_hero_shredder": (0.05, 0.25, 0.70),
    "npc_dota_hero_pudge": (0.20, 0.45, 0.35),
    "npc_dota_hero_axe": (0.25, 0.05, 0.70),
    "npc_dota_hero_zuus": (0.02, 0.98, 0.0),
    "npc_dota_hero_spectre": (0.50, 0.15, 0.35),
    "npc_dota_hero_silencer": (0.20, 0.30, 0.50),
    "npc_dota_hero_queenofpain": (0.15, 0.55, 0.30),
    "npc_dota_hero_drow_ranger": (0.95, 0.05, 0.0),
    "npc_dota_hero_sniper": (0.85, 0.15, 0.0),
    "npc_dota_hero_faceless_void": (0.90, 0.10, 0.0),
    "npc_dota_hero_muerta": (0.10, 0.90, 0.0),
    "npc_dota_hero_bristleback": (0.90, 0.10, 0.0),
    "npc_dota_hero_leshrac": (0.05, 0.95, 0.0),
    "npc_dota_hero_necrolyte": (0.05, 0.95, 0.0),
    "npc_dota_hero_sven": (0.95, 0.05, 0.0),
    "npc_dota_hero_ursa": (0.95, 0.05, 0.0),
    "npc_dota_hero_mars": (0.70, 0.30, 0.0),
}


def _calculate_damage_profile(
    hero_name: Optional[str],
    abilities: Optional[Dict[str, AbilityData]],
    items: Optional[Dict[str, ItemData]],
) -> Tuple[float, float, float]:
    base = HERO_BASE_PROFILES.get(hero_name or "", (0.60, 0.35, 0.05))
    phys_acc = base[0] * 3.0
    magic_acc = base[1] * 3.0
    pure_acc = base[2] * 3.0

    if abilities:
        for ability in abilities.values():
            if ability and ability.name and ability.level and ability.level > 0:
                weights = ABILITY_DAMAGE_MAP.get(ability.name)
                if weights:
                    lvl_multiplier = float(ability.level)
                    phys_acc += weights[0] * lvl_multiplier
                    magic_acc += weights[1] * lvl_multiplier
                    pure_acc += weights[2] * lvl_multiplier

    if items:
        for item in items.values():
            if item and item.name and item.name != "empty":
                weights = ITEM_DAMAGE_WEIGHTS.get(item.name)
                if weights:
                    phys_acc += weights[0] * 2.0
                    magic_acc += weights[1] * 2.0
                    pure_acc += weights[2] * 2.0

    total = phys_acc + magic_acc + pure_acc
    if total <= 0:
        return (0.60, 0.35, 0.05)

    return (
        round(phys_acc / total, 3),
        round(magic_acc / total, 3),
        round(pure_acc / total, 3),
    )


def _compute_defense_matrix(
    hero_data: Optional[HeroData],
    items: Optional[Dict[str, ItemData]],
) -> DefenseMatrix:
    base_magic_resist = 0.25
    base_armor = 3.0
    if hero_data and hero_data.level:
        base_armor += (hero_data.level - 1) * 0.4

    extra_magic_resist_multi = 1.0 - base_magic_resist
    extra_armor = 0.0

    if items:
        for item in items.values():
            if item and item.name and item.name != "empty":
                if item.name in MAGIC_RESIST_ITEMS:
                    item_mr = MAGIC_RESIST_ITEMS[item.name]
                    extra_magic_resist_multi *= (1.0 - item_mr)
                if item.name in ARMOR_ITEMS:
                    extra_armor += ARMOR_ITEMS[item.name]

    total_armor = round(base_armor + extra_armor, 1)
    if total_armor >= 0:
        physical_reduction = (0.06 * total_armor) / (1.0 + 0.06 * total_armor)
    else:
        physical_reduction = -((0.06 * abs(total_armor)) / (1.0 + 0.06 * abs(total_armor)))

    total_magic_resist = 1.0 - extra_magic_resist_multi

    return DefenseMatrix(
        armor=total_armor,
        physical_reduction_pct=round(physical_reduction * 100.0, 1),
        magic_resistance_pct=round(total_magic_resist * 100.0, 1),
        pure_vulnerability_pct=100.0,
    )


def compute_damage_analytics(
    player_data: Optional[PlayerData],
    hero_data: Optional[HeroData],
    abilities: Optional[Dict[str, AbilityData]],
    items: Optional[Dict[str, ItemData]],
    clock_time: Optional[int],
) -> DamageAnalytics:
    hero_damage = player_data.hero_damage if player_data and player_data.hero_damage else 0
    hero_name = hero_data.name if hero_data else None

    phys_ratio, magic_ratio, pure_ratio = _calculate_damage_profile(hero_name, abilities, items)

    phys_pct = round(phys_ratio * 100.0, 1)
    magic_pct = round(magic_ratio * 100.0, 1)
    pure_pct = round(max(0.0, 100.0 - phys_pct - magic_pct), 1)

    phys_dmg = int(hero_damage * (phys_pct / 100.0))
    magic_dmg = int(hero_damage * (magic_pct / 100.0))
    pure_dmg = max(0, hero_damage - phys_dmg - magic_dmg)

    dpm = 0.0
    if clock_time and clock_time > 30 and hero_damage > 0:
        minutes = clock_time / 60.0
        dpm = round(hero_damage / minutes, 1)

    defense = _compute_defense_matrix(hero_data, items)

    return DamageAnalytics(
        total_hero_damage=hero_damage,
        dpm=dpm,
        breakdown=DamageBreakdown(
            physical_damage=phys_dmg,
            physical_pct=phys_pct,
            magical_damage=magic_dmg,
            magical_pct=magic_pct,
            pure_damage=pure_dmg,
            pure_pct=pure_pct,
        ),
        defense=defense,
    )
