import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import ProductImageCarousel from '@/components/ui/ProductImageCarousel'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/data/products'
import { isProductRecentlyAdded } from '@/lib/catalog-newness'

interface ProductCardProps {
  product: Product
  index?: number
  featured?: boolean
  compactMobile?: boolean
  className?: string
}

export default function ProductCard({
  product,
  featured = false,
  compactMobile = false,
  className = '',
}: ProductCardProps) {
  const hasMultipleImages = (product.images?.length ?? 0) > 1
  const previewImageFit = product.imageFit
  const isNew = isProductRecentlyAdded(product)
  const mediaAspectClass = compactMobile
    ? featured
      ? 'aspect-[4/5] md:aspect-[4/5] lg:aspect-[5/4]'
      : 'aspect-[4/5] md:aspect-[4/3]'
    : featured
      ? 'aspect-[4/5] lg:aspect-[5/4]'
      : 'aspect-[4/3]'

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden border border-sand bg-cream transition duration-200 hover:border-brown/40 ${
        compactMobile
          ? 'rounded-[16px] shadow-[0_10px_28px_rgba(79,62,42,0.07)] md:rounded-[28px] md:shadow-[0_20px_60px_rgba(79,62,42,0.08)] md:hover:shadow-[0_24px_64px_rgba(79,62,42,0.1)]'
          : 'rounded-[28px] shadow-[0_20px_60px_rgba(79,62,42,0.08)] hover:shadow-[0_24px_64px_rgba(79,62,42,0.1)]'
      } ${className}`}
    >
      <Link
        href={`/catalog/${product.slug}`}
        aria-label={`Lihat detail ${product.name}`}
        className="absolute inset-0 z-20"
      />

      <div className={`relative w-full overflow-hidden bg-sand ${mediaAspectClass}`}>
        <ProductImageCarousel
          images={product.images ?? [product.image]}
          alt={`Foto produk ${product.name}`}
          controls={hasMultipleImages}
          imageFit={previewImageFit}
          imagePosition={product.imagePosition}
          imageZoom={product.imageZoom}
          imagePositions={product.imagePositions}
          compact={compactMobile}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/18 via-transparent to-transparent opacity-80 transition duration-200 group-hover:opacity-95" />

        {isNew && (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-white/45 bg-brown px-3 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.16em] text-silk shadow-[0_10px_24px_rgba(79,62,42,0.18)] md:left-4 md:top-4">
            Baru
          </span>
        )}

        <div
          className={`absolute flex items-center justify-between border border-sand bg-silk shadow-[0_12px_28px_rgba(31,45,34,0.16)] ${
            compactMobile
              ? 'bottom-3 left-3 right-3 hidden gap-3 rounded-[14px] px-3.5 py-2.5 md:flex md:w-fit md:max-w-[calc(100%-1.5rem)]'
              : 'bottom-3 left-3 right-3 w-fit max-w-[calc(100%-1.5rem)] gap-3 rounded-[14px] px-3.5 py-2.5'
          }`}
        >
          <div className="min-w-0">
            <p
              className={`font-sans uppercase text-stone ${
                compactMobile
                  ? 'hidden text-[7px] tracking-[0.12em] md:block md:text-[8px] md:tracking-[0.18em]'
                  : 'text-[8px] tracking-[0.18em]'
              }`}
            >
              {product.subcategory.replaceAll('-', ' ')}
            </p>
            <p
              className={`font-serif leading-tight text-ink ${
                compactMobile
                  ? 'line-clamp-2 text-[13px] md:mt-1 md:line-clamp-1 md:text-lg'
                  : 'mt-1 line-clamp-1 text-lg'
              }`}
            >
              {product.name}
            </p>
          </div>
          <span
            className={`shrink-0 place-items-center rounded-full border border-sand bg-cream text-brown transition duration-200 group-hover:border-brown group-hover:bg-brown group-hover:text-silk ${
              compactMobile ? 'hidden h-9 w-9 md:grid' : 'grid h-9 w-9'
            }`}
          >
            <ArrowUpRight size={15} aria-hidden />
          </span>
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${compactMobile ? 'p-2 md:p-5 lg:p-6' : 'p-5 sm:p-6'}`}>
        {compactMobile && (
          <div className="mb-2 rounded-[10px] border border-sand bg-silk px-2 py-2 shadow-[0_8px_18px_rgba(31,45,34,0.08)] md:hidden">
            <p className="line-clamp-2 font-serif text-[13px] leading-tight text-ink">
              {product.name}
            </p>
          </div>
        )}

        <div className={`mb-4 items-center justify-between gap-3 ${compactMobile ? 'hidden md:flex' : 'flex'}`}>
          <Badge
            variant={
              product.category === 'batik-tulis'
                ? 'tulis'
                : product.category === 'batik-cap'
                  ? 'cap'
                  : 'lain'
            }
          />
          <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-stone/55">
            {isNew ? 'Baru' : product.isPreorder ? 'Pre-order' : 'Tersedia'}
          </span>
        </div>

        <p
          className={`font-serif leading-snug text-ink transition-colors duration-200 group-hover:text-brown ${
            compactMobile ? 'hidden text-2xl md:block' : 'text-2xl'
          }`}
        >
          {product.motif}
        </p>

        <p className={`mt-3 font-sans text-sm italic leading-relaxed text-stone ${compactMobile ? 'hidden md:block' : ''}`}>
          {product.buildingStory}
        </p>

        <div
          className={`mt-auto flex items-end justify-between gap-4 border-sand ${
            compactMobile ? 'border-t-0 pt-0 md:border-t md:pt-5' : 'border-t pt-5'
          }`}
        >
          <div className="min-w-0">
            <p className={`font-sans uppercase tracking-[0.18em] text-stone/55 ${compactMobile ? 'text-[7px] md:text-[8px]' : 'text-[8px]'}`}>
              Harga
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-1 md:gap-2">
              <span className={`font-sans text-ink ${compactMobile ? 'text-[11px] md:text-sm' : 'text-sm'}`}>
                {formatPrice(product.price)}
              </span>
              {product.priceNote && (
                <span className={`font-sans text-stone ${compactMobile ? 'hidden text-xs md:inline' : 'text-xs'}`}>
                  - {product.priceNote}
                </span>
              )}
            </div>
          </div>

          <span
            className={`rounded-full border border-sand bg-silk font-sans uppercase tracking-[0.16em] text-stone transition duration-200 group-hover:border-brown group-hover:text-brown ${
              compactMobile ? 'hidden px-3 py-2 text-[8px] md:inline-block' : 'px-3 py-2 text-[8px]'
            }`}
          >
            Detail
          </span>
        </div>
      </div>
    </article>
  )
}
