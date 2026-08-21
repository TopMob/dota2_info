export type UrgencyLevel = 'normal' | 'warning_30s' | 'critical_10s' | 'active'

export type TimerCategory =
  | 'water_rune'
  | 'bounty_rune'
  | 'powerup_rune'
  | 'wisdom_rune'
  | 'lotus_pool'
  | 'neutral_tier'
  | 'tormentor'
  | 'day_night'
  | 'stack_pull'
  | 'roshan'

export interface TacticalTimer {
  id: string
  category: TimerCategory
  name: string
  remaining_seconds: number
  next_event_time: number
  urgency: UrgencyLevel
  icon: string
  description: string
}

export type BuybackStatus = 'READY' | 'NO_GOLD' | 'COOLDOWN'

export interface EconomyAnalytics {
  gold: number
  gold_reliable: number
  gold_unreliable: number
  net_worth: number
  gpm: number
  xpm: number
  last_hits: number
  denies: number
  cs_per_min: number
  buyback_cost: number
  buyback_cooldown: number
  buyback_status: BuybackStatus
  gold_surplus: number
  gold_deficit: number
}

export type RoshanStatus =
  | 'alive'
  | 'aegis_held'
  | 'respawn_window'
  | 'respawn_guaranteed'
  | 'unknown'

export interface RoshanAnalytics {
  status: RoshanStatus
  state_end_seconds: number
  death_clock_time?: number | null
  aegis_expires_clock?: number | null
  min_respawn_clock?: number | null
  max_respawn_clock?: number | null
  death_count: number
  expected_drops: string[]
}

export interface HeroStatusInfo {
  hero_id?: number | null
  hero_name: string
  hero_display_name: string
  level: number
  alive: boolean
  respawn_seconds: number
  health: number
  max_health: number
  health_percent: number
  mana: number
  max_mana: number
  mana_percent: number
  active_debuffs: string[]
}

export interface ItemSlotData {
  name: string
  purchaser?: number | null
  can_cast?: boolean
  cooldown?: number
  passive?: boolean
  item_level?: number
  charges?: number
  contains_rune?: string | null
}

export interface AbilitySlotData {
  name?: string
  level?: number
  can_cast?: boolean
  passive?: boolean
  ability_active?: boolean
  cooldown?: number
  ultimate?: boolean
  charges?: number | null
  max_charges?: number | null
  charge_cooldown?: number | null
}

export interface DamageBreakdown {
  physical_damage: number
  physical_pct: number
  magical_damage: number
  magical_pct: number
  pure_damage: number
  pure_pct: number
}

export interface DefenseMatrix {
  armor: number
  physical_reduction_pct: number
  magic_resistance_pct: number
  pure_vulnerability_pct: number
}

export interface DamageAnalytics {
  total_hero_damage: number
  dpm: number
  breakdown: DamageBreakdown
  defense: DefenseMatrix
}

export interface ItemRecommendation {
  item_id: string
  display_name: string
  cost: number
  remaining_gold: number
  progress_pct: number
  eta_seconds: number
  eta_formatted: string
  is_safe_with_buyback: boolean
  reason: string
  tags: string[]
  is_situational: boolean
}

export interface ItemPredictorAnalytics {
  game_stage: string
  next_core_item?: ItemRecommendation | null
  situational_items: ItemRecommendation[]
}

export interface NeutralItemSuggestion {
  item_id: string
  name: string
  tier: number
  rank: number
  stat_bonus: string
  ability: string
  synergy_reason: string
}

export interface NeutralTierStatus {
  tier: number
  name: string
  unlock_clock: number
  is_unlocked: boolean
  seconds_remaining: number
}

export interface NeutralAdvisorAnalytics {
  current_tier: number
  target_tier: number
  seconds_to_next_tier: number
  next_tier_formatted: string
  equipped_item_name: string
  has_neutral_equipped: boolean
  tier_statuses: NeutralTierStatus[]
  top_suggestions: NeutralItemSuggestion[]
}

export type FarmPacingGrade = 'S+' | 'S' | 'A' | 'B' | 'C'

export interface FarmCoachAnalytics {
  grade: FarmPacingGrade
  efficiency_pct: number
  target_cs: number
  cs_delta: number
  target_net_worth: number
  net_worth_delta: number
  is_stack_window: boolean
  stack_countdown_seconds: number
  tactical_tips: string[]
}

export type TormentorStatus = 'not_spawned' | 'alive' | 'respawning'

export interface TormentorAnalytics {
  status: TormentorStatus
  remaining_seconds: number
  has_shard: boolean
  shard_advice: string
  should_buy_from_shop: boolean
}

export interface PostGameDebrief {
  match_id: string
  duration_formatted: string
  overall_score: number
  radiant_score: number
  dire_score: number
  total_hero_damage: number
  dpm: number
  gpm: number
  xpm: number
  net_worth: number
  last_hits: number
  denies: number
  highlights: string[]
  improvement_areas: string[]
}

export interface ProcessedGameState {
  is_connected: boolean
  match_id?: string | null
  game_time: number
  clock_time: number
  formatted_clock: string
  game_state: string
  is_daytime: boolean
  is_paused: boolean
  radiant_score: number
  dire_score: number
  hero: HeroStatusInfo
  economy: EconomyAnalytics
  roshan: RoshanAnalytics
  timers: TacticalTimer[]
  damage?: DamageAnalytics
  item_prediction?: ItemPredictorAnalytics
  neutral_advisor?: NeutralAdvisorAnalytics
  farm_coach?: FarmCoachAnalytics
  tormentor?: TormentorAnalytics
  post_game?: PostGameDebrief | null
  items: Record<string, ItemSlotData>
  abilities: Record<string, AbilitySlotData>
}

export type EventType =
  | 'INITIAL_STATE'
  | 'GAME_STATE_UPDATE'
  | 'TIMER_ALERT'
  | 'SOUND_CUE'
  | 'ROSHAN_ALERT'
  | 'BUYBACK_ALERT'
  | 'PING'
  | 'PONG'

export interface SoundCuePayload {
  sound_id: string
  label: string
  urgency: string
  volume: number
}

export interface WSMessage<T = unknown> {
  type: EventType
  timestamp: number
  clock_time: number
  payload: T
}

export interface InAppAlertItem {
  id: string
  title: string
  label: string
  urgency: 'normal' | 'warning' | 'critical'
  timestamp: number
}
