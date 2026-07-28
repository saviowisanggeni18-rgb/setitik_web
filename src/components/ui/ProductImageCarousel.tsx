'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductImageCarouselProps {
  images: string[]
  alt: string
  controls?: boolean
  autoPlay?: boolean
  imageFit?: 'cover' | 'contain'
  imagePosition?: string
  imageZoom?: number
  imagePositions?: string[]
  compact?: boolean
}

export default function ProductImageCarousel({
  images,
  alt,
  controls = true,
  autoPlay = false,
  imageFit = 'cover',
  imagePosition = 'center',
  imageZoom = 1,
  imagePositions,
  compact = false,
}: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const hasMultipleImages = images.length > 1

  useEffect(() => {
    if (!autoPlay || !hasMultipleImages || isPaused) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [autoPlay, hasMultipleImages, images.length, isPaused])

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % images.length)
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => controls && setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => controls && setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription={hasMultipleImages ? 'carousel' : undefined}
      aria-label={alt}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div
            key={src}
            className="relative flex h-full min-w-full items-center justify-center overflow-hidden bg-silk"
            aria-hidden={index !== activeIndex}
          >
            {imageFit === 'contain' && (
              <>
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover opacity-35 blur-xl"
                  draggable={false}
                />
                <div
                  className="absolute inset-0 bg-ink/10"
                  aria-hidden
                />
              </>
            )}
            <img
              src={src}
              alt={`${alt} — model ${index + 1} dari ${images.length}`}
              className={`relative z-10 h-full w-full ${
                imageFit === 'contain' ? 'object-contain' : 'object-cover'
              }`}
              style={{
                objectPosition: imagePositions?.[index] ?? imagePosition,
                transform: `scale(${imageZoom})`,
                transformOrigin: imagePositions?.[index] ?? imagePosition,
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {hasMultipleImages && controls && (
        <>
          <button
            type="button"
            onClick={showPrevious}
            className={`absolute top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-silk/90 text-ink shadow-sm transition-colors hover:bg-silk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown md:block ${
              compact
                ? 'left-3 p-2'
                : 'left-3 p-2'
            }`}
            aria-label="Lihat model sebelumnya"
          >
            <ChevronLeft size={compact ? 16 : 20} aria-hidden />
          </button>
          <button
            type="button"
            onClick={showNext}
            className={`absolute top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-silk/90 text-ink shadow-sm transition-colors hover:bg-silk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown md:block ${
              compact
                ? 'right-3 p-2'
                : 'right-3 p-2'
            }`}
            aria-label="Lihat model berikutnya"
          >
            <ChevronRight size={compact ? 16 : 20} aria-hidden />
          </button>
        </>
      )}

      {hasMultipleImages && (
        <div
          className={`absolute z-30 flex items-center rounded-full border border-white/20 bg-forest/38 shadow-sm backdrop-blur-md ${
            compact
              ? 'right-1.5 top-1.5 gap-1 px-1.5 py-1 md:right-4 md:top-4 md:gap-2 md:px-3 md:py-2'
              : 'right-2 top-2 gap-1 px-2 py-1 md:right-4 md:top-4 md:gap-2 md:px-3 md:py-2'
          }`}
          aria-label={`Model ${activeIndex + 1} dari ${images.length}`}
        >
          <span
            className={`font-sans font-semibold uppercase tracking-[0.14em] text-white/80 ${
              compact ? 'hidden text-[8px] md:inline' : 'hidden text-[8px] md:inline'
            }`}
          >
            {activeIndex + 1}/{images.length}
          </span>
          {images.map((src, index) =>
            controls ? (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-full transition-all ${
                  index === activeIndex
                    ? compact
                      ? 'h-1.5 w-3 bg-brown md:w-5'
                      : 'h-1.5 w-5 bg-brown'
                    : compact
                      ? 'h-1.5 w-1.5 bg-white/45 hover:bg-white/80'
                      : 'h-1.5 w-1.5 bg-white/45 hover:bg-white/80'
                }`}
                aria-label={`Lihat model ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ) : (
              <span
                key={src}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? compact
                      ? 'w-3 bg-brown md:w-5'
                      : 'w-5 bg-brown'
                    : 'w-1.5 bg-white/45'
                }`}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
