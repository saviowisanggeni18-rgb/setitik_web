import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessageCircle, ShoppingBag } from 'lucide-react'
import { products, type Product } from '@/data/products'
import { getCatalogProductBySlug, listCatalogProducts } from '@/lib/catalog-products'
import { formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import ProductImageCarousel from '@/components/ui/ProductImageCarousel'
import ProductCard from '@/components/sections/ProductCard'

interface Props {
  params: Promise<{ slug: string }>
}

const WHATSAPP_NUMBER = '6282342303651'
const SHOPEE_URL = 'https://id.shp.ee/8M3yoQo5'

export const dynamic = 'force-dynamic'

const categoryLabel: Record<Product['category'], string> = {
  'batik-tulis': 'Batik Tulis',
  'batik-cap': 'Batik Cap',
  'produk-lain': 'Produk Lain',
}

const categoryHref: Record<Product['category'], string> = {
  'batik-tulis': '/catalog',
  'batik-cap': '/catalog',
  'produk-lain': '/catalog',
}

const badgeVariant = (category: Product['category']) => {
  if (category === 'batik-tulis') return 'tulis' as const
  if (category === 'batik-cap') return 'cap' as const
  return 'lain' as const
}

type BuildingVisual = {
  name: string
  image: string
  position?: string
  zoom?: number
}

function getBuildingVisuals(product: Product): BuildingVisual[] {
  const motifText = product.motif.toLowerCase()
  const buildingText = product.buildingFull.toLowerCase()
  const searchableText = `${motifText} ${buildingText}`
  const visuals: BuildingVisual[] = []

  if (product.buildingImage) {
    return [
      {
        name: product.buildingFull,
        image: product.buildingImage,
        position: product.buildingImagePosition,
        zoom: product.buildingImageZoom,
      },
    ]
  }

  const buildingReferences = [
    {
      tokens: ['monod'],
      name: 'Gedung Monod Diephuis',
      image: '/images/locations/semarang-monod-diephuis.jpg',
    },
    {
      tokens: ['gereja blenduk'],
      name: 'Gereja Blenduk',
      image: '/images/locations/semarang-gereja-blenduk.jpg',
    },
    {
      tokens: ['nhm', 'nederlandsche handels maatschappij'],
      name: 'Gedung Nederlandsche Handels Maatschappij (NHM)',
      image: '/images/locations/semarang-nhm.jpg',
    },
  ]

  buildingReferences
    .map((reference) => ({
      ...reference,
      order: Math.min(
        ...reference.tokens
          .map((token) => searchableText.indexOf(token))
          .filter((index) => index >= 0),
      ),
    }))
    .filter((reference) => Number.isFinite(reference.order))
    .sort((a, b) => a.order - b.order)
    .forEach((reference) => {
      visuals.push({
        name: reference.name,
        image: reference.image,
      })
    })

  if (visuals.length > 0) {
    return visuals
  }

  if (searchableText.includes('kota lama')) {
    return [
      {
        name: product.buildingFull,
        image: '/images/locations/semarang-kota-lama-marba.jpg',
      },
    ]
  }

  return [
    {
      name: product.buildingFull,
      image: '/images/locations/semarang-gereja-blenduk.jpg',
    },
  ]
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getCatalogProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.motif} — ${categoryLabel[product.category]}`,
    description: product.buildingStory,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getCatalogProductBySlug(slug)
  if (!product) notFound()

  const waMessage = encodeURIComponent(
    `Halo Setitik, saya tertarik dengan ${product.name} (motif ${product.motif}). Bisa ceritakan lebih lanjut?`
  )
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`
  const shopeeUrl = product.shopeeUrl || SHOPEE_URL
  const catalogProducts = await listCatalogProducts()
  const relatedProducts = catalogProducts
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 3)
  const buildingVisuals = getBuildingVisuals(product)

  return (
    <div className="px-6 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb produk"
          className="mb-6 font-sans"
        >
          <p className="mb-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-stone/60">
            Anda sedang melihat
          </p>
          <ol className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.14em]">
            <li>
              <Link
                href="/catalog"
                className="inline-flex h-9 items-center rounded-full border border-brown/35 bg-silk px-3.5 text-brown shadow-[0_6px_18px_rgba(79,62,42,0.05)] transition-colors duration-200 hover:border-forest hover:bg-forest hover:text-silk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown/35"
              >
                Katalog
              </Link>
            </li>
            <li className="flex items-center" aria-hidden>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brown text-[11px] font-bold leading-none text-silk shadow-sm">
                ›
              </span>
            </li>
            <li>
              <Link
                href={categoryHref[product.category]}
                className="inline-flex h-9 items-center rounded-full border border-sand bg-cream px-3.5 text-stone transition-colors duration-200 hover:border-brown hover:bg-silk hover:text-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown/30"
              >
                {categoryLabel[product.category]}
              </Link>
            </li>
            <li className="flex items-center" aria-hidden>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brown text-[11px] font-bold leading-none text-silk shadow-sm">
                ›
              </span>
            </li>
            <li>
              <span
                aria-current="page"
                className="inline-flex h-9 items-center rounded-full border border-forest bg-forest px-3.5 font-semibold text-silk shadow-[0_8px_24px_rgba(44,62,48,0.14)]"
              >
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        <section className="overflow-hidden rounded-[36px] border border-sand bg-cream shadow-[0_34px_100px_rgba(79,62,42,0.1)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[430px] overflow-hidden bg-sand sm:min-h-[560px] lg:min-h-[760px]">
              <ProductImageCarousel
                images={product.images ?? [product.image]}
                alt={`Foto produk ${product.name}`}
                imageFit={product.imageFit}
                imagePosition={product.imagePosition}
                imageZoom={product.imageZoom}
                imagePositions={product.imagePositions}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6 sm:gap-5">
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/68">
                    Foto produk
                  </p>
                  <p className="mt-2 max-w-lg font-serif text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
                    {product.name}
                  </p>
                </div>
                <span className="hidden rounded-full border border-white/20 bg-silk/15 px-4 py-3 font-sans text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur sm:inline-flex">
                  {product.images?.length ?? 1} model
                </span>
              </div>
            </div>

            <div className="relative bg-silk p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full bg-brown/10 blur-3xl"
              />

              <div className="relative">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                  <Badge variant={badgeVariant(product.category)} />
                  <span className="rounded-full border border-sand bg-cream px-4 py-2 font-sans text-[9px] uppercase tracking-[0.16em] text-stone">
                    {product.isPreorder ? 'Pre-order' : 'Tersedia'}
                  </span>
                </div>

                <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-brown">
                  Motif
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-ink md:text-5xl">
                  {product.motif}
                </h1>
                <p className="mt-5 max-w-xl font-sans text-sm italic leading-[1.85] text-stone">
                  {product.buildingStory}
                </p>

                <div className="mt-8 rounded-[26px] border border-sand bg-cream p-4 shadow-[0_18px_48px_rgba(79,62,42,0.06)] sm:p-5">
                  <div className="mb-4 flex flex-col gap-2 border-b border-sand pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-brown">
                        Bangunan asli
                      </p>
                      <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">
                        {product.buildingFull}
                      </h2>
                    </div>
                    {product.buildingBuilt && (
                      <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-stone">
                        Dibangun {product.buildingBuilt}
                      </p>
                    )}
                  </div>

                  <div
                    className={`grid gap-3 ${
                      buildingVisuals.length >= 3
                        ? 'grid-cols-3'
                        : buildingVisuals.length === 2
                          ? 'grid-cols-2'
                          : ''
                    }`}
                  >
                    {buildingVisuals.map((visual, index) => (
                      <figure
                        key={visual.name}
                        className="overflow-hidden rounded-[18px] border border-sand bg-silk"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={visual.image}
                            alt={`Referensi visual ${visual.name}`}
                            className="h-full w-full object-cover"
                            style={{
                              objectPosition: visual.position ?? 'center',
                              transform: `scale(${visual.zoom ?? 1})`,
                              transformOrigin: visual.position ?? 'center',
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                          <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/90 px-2.5 py-1.5 font-sans text-[7px] uppercase tracking-[0.14em] text-forest shadow-sm">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <figcaption className="flex min-h-14 items-center px-3.5 py-3 font-sans text-[9px] font-semibold uppercase leading-relaxed tracking-[0.13em] text-stone">
                          {visual.name}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Produk', product.name],
                    ['Material', product.material],
                    ['Ukuran', product.dimensions],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[20px] border border-sand bg-cream p-4">
                      <p className="font-sans text-[8px] uppercase tracking-[0.18em] text-stone/60">
                        {label}
                      </p>
                      <p className="mt-2 font-sans text-sm leading-snug text-ink">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 overflow-hidden rounded-[28px] bg-forest text-silk shadow-[0_24px_70px_rgba(31,45,34,0.16)]">
                  <div className="grid gap-5 p-5 sm:p-6">
                    <div className="min-w-0">
                      <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-silk/45">
                        Harga
                      </p>
                      <p className="mt-2 font-serif text-4xl text-silk">
                        {formatPrice(product.price)}
                      </p>
                      {product.priceNote && (
                        <p className="mt-2 font-sans text-xs text-silk/55">
                          {product.priceNote}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-[58px] w-full items-center gap-3 rounded-[18px] border border-silk/15 bg-silk/8 px-4 text-left transition hover:border-silk/30 hover:bg-silk hover:text-forest"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brown text-silk transition group-hover:bg-forest">
                          <MessageCircle size={17} aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-sans text-[8px] font-semibold uppercase tracking-[0.16em] opacity-55">
                            Tanya dulu
                          </span>
                          <span className="mt-1 block break-words font-sans text-[10px] font-semibold uppercase tracking-[0.14em]">
                            Chat WhatsApp
                          </span>
                        </span>
                      </a>

                      <a
                        href={shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-[58px] w-full items-center gap-3 rounded-[18px] bg-[#ee4d2d] px-4 text-left text-white shadow-[0_14px_32px_rgba(238,77,45,0.24)] transition hover:bg-[#d84224]"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/18 text-white ring-1 ring-white/24">
                          <ShoppingBag size={17} aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-sans text-[8px] font-semibold uppercase tracking-[0.16em] text-white/70">
                            Checkout cepat
                          </span>
                          <span className="mt-1 block break-words font-sans text-[10px] font-semibold uppercase tracking-[0.14em]">
                            Beli di Shopee
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-10 md:mt-12">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-stone">
                  Lihat juga
                </p>
                <h2 className="mt-2 font-serif text-3xl text-ink">
                  Produk dengan kategori serupa
                </h2>
              </div>
              <Link
                href="/catalog"
                className="font-sans text-[10px] uppercase tracking-[0.16em] text-brown transition hover:text-forest"
              >
                Kembali ke katalog →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {relatedProducts.map((item, index) => (
                <ProductCard key={item.slug} product={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
