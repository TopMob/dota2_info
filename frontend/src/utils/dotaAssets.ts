// Dota 2 Asset Resolver & Normalization Utility
// Follows antislop: clean, robust, deterministic fallback without generic placeholders

const STEAM_CDN_BASE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react'

export interface AssetUrlPair {
  localUrl: string
  cdnUrl: string
  displayName: string
  isAvailable: boolean
}

/**
 * Normalizes hero internal name (e.g. "npc_dota_hero_antimage" -> "antimage")
 */
export const normalizeHeroName = (rawName?: string): string => {
  if (!rawName) return ''
  return rawName.toLowerCase().replace('npc_dota_hero_', '').trim()
}

/**
 * Returns local and CDN URLs for a hero portrait.
 */
export const getHeroAsset = (rawName?: string, displayName?: string): AssetUrlPair => {
  const slug = normalizeHeroName(rawName)
  if (!slug) {
    return {
      localUrl: '',
      cdnUrl: '',
      displayName: displayName || 'Unknown Hero',
      isAvailable: false,
    }
  }

  return {
    localUrl: `/dota_assets/heroes/${slug}.png`,
    cdnUrl: `${STEAM_CDN_BASE}/heroes/${slug}.png`,
    displayName: displayName || formatSlugToTitle(slug),
    isAvailable: true,
  }
}

/**
 * Normalizes item internal name (e.g. "item_blink" -> "blink")
 */
export const normalizeItemName = (rawName?: string): string => {
  if (!rawName || rawName === 'empty') return ''
  return rawName.toLowerCase().replace(/^item_/, '').trim()
}

/**
 * Returns local and CDN URLs for an item icon.
 */
export const getItemAsset = (rawName?: string, customDisplayName?: string): AssetUrlPair => {
  const slug = normalizeItemName(rawName)
  if (!slug) {
    return {
      localUrl: '',
      cdnUrl: '',
      displayName: customDisplayName || 'Empty Slot',
      isAvailable: false,
    }
  }

  // Handle recipe items
  const actualSlug = slug.startsWith('recipe_') ? 'recipe' : slug

  return {
    localUrl: `/dota_assets/items/${actualSlug}.png`,
    cdnUrl: `${STEAM_CDN_BASE}/items/${actualSlug}.png`,
    displayName: customDisplayName || formatSlugToTitle(slug),
    isAvailable: true,
  }
}

/**
 * Normalizes ability internal name (e.g. "antimage_mana_break")
 */
export const normalizeAbilityName = (rawName?: string): string => {
  if (!rawName) return ''
  return rawName.toLowerCase().trim()
}

/**
 * Returns local and CDN URLs for an ability spell icon.
 */
export const getAbilityAsset = (rawName?: string, customDisplayName?: string): AssetUrlPair => {
  const slug = normalizeAbilityName(rawName)
  if (!slug) {
    return {
      localUrl: '',
      cdnUrl: '',
      displayName: customDisplayName || 'Ability',
      isAvailable: false,
    }
  }

  return {
    localUrl: `/dota_assets/abilities/${slug}.png`,
    cdnUrl: `${STEAM_CDN_BASE}/abilities/${slug}.png`,
    displayName: customDisplayName || formatAbilityTitle(slug),
    isAvailable: true,
  }
}

/**
 * Utility to turn snake_case or slug into clean readable English Title
 */
export const formatSlugToTitle = (slug: string): string => {
  if (!slug) return ''
  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Utility to format ability names compactly
 */
export const formatAbilityTitle = (slug: string): string => {
  if (!slug) return ''
  // If starts with hero prefix, drop hero prefix for short display if desired
  const parts = slug.split('_').filter(Boolean)
  if (parts.length > 2) {
    return parts.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
  return formatSlugToTitle(slug)
}
