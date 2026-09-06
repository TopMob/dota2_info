import React, { useState } from 'react'
import { AssetUrlPair } from '../../utils/dotaAssets'

interface DotaImageProps {
  asset: AssetUrlPair
  alt?: string
  className?: string
  fallbackText?: string
  aspectRatio?: 'square' | 'item' | 'hero'
  title?: string
}

export const DotaImage: React.FC<DotaImageProps> = ({
  asset,
  alt,
  className = '',
  fallbackText,
  aspectRatio = 'square',
  title,
}) => {
  const [useCdn, setUseCdn] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const effectiveSrc = useCdn ? asset.cdnUrl : asset.localUrl

  const handleImageError = () => {
    if (!useCdn && asset.cdnUrl) {
      // Try official Steam CDN fallback
      setUseCdn(true)
    } else {
      // Both local and CDN failed
      setHasError(true)
    }
  }

  const fallbackDisplay =
    fallbackText ||
    (asset.displayName
      ? asset.displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
      : '?')

  const aspectClass =
    aspectRatio === 'hero'
      ? 'aspect-[16/9]'
      : aspectRatio === 'item'
      ? 'aspect-[4/3]'
      : 'aspect-square'

  if (!asset.isAvailable || hasError || !effectiveSrc) {
    return (
      <div
        className={`flex items-center justify-center font-mono font-bold select-none bg-slate-900/90 text-slate-400 border border-white/10 ${aspectClass} ${className}`}
        title={title || asset.displayName}
      >
        <span className="text-[11px] uppercase tracking-wider">{fallbackDisplay}</span>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden bg-slate-950 flex items-center justify-center ${aspectClass} ${className}`}
      title={title || asset.displayName}
    >
      <img
        src={effectiveSrc}
        alt={alt || asset.displayName}
        loading="lazy"
        onError={handleImageError}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
          <span className="text-[9px] font-mono text-slate-600">{fallbackDisplay}</span>
        </div>
      )}
    </div>
  )
}
