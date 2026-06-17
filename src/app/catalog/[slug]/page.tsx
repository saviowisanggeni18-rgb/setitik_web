import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { products, getProductBySlug } from '@/data/products'
import { formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'

interface Props {
  params: Promise<{ slug: string }>
}

const WHATSAPP_NUMBER = '6282342303651'

const categoryLabel: Record<string, string> = {
  'batik-tulis': 'Batik Tulis',
  'batik-cap': 'Batik Cap',
  'produk-lain': 'Produk Lain',
}

const badgeVariant = (category: string) => {
  if (category === 'batik-tulis') return 'tulis' as const
  if (category === 'batik-cap') return 'cap' as const
  return 'lain' as const
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.motif} — ${categoryLabel[product.category] ?? product.category}`,
    description: product.buildingStory,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const waMessage = encodeURIComponent(
    `Halo Setitik, saya tertarik dengan ${product.name} (motif ${product.motif}). Bisa ceritakan lebih lanjut?`
  )
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`

  const catLabel = categoryLabel[product.category] ?? product.category

  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-xs text-stone mb-10">
          <Link href="/catalog" className="hover:text-brown transition-colors duration-200">
            Koleksi
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/catalog?filter=${product.category}`}
            className="hover:text-brown transition-colors duration-200"
          >
            {catLabel}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">{product.motif}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Kolom kiri — gambar produk */}
          <div
            className="w-full aspect-square bg-sand rounded-sm"
            role="img"
            aria-label={`Foto produk ${product.name}`}
          />

          {/* Kolom kanan — info produk */}
          <div className="flex flex-col">

            {/* Badge kategori */}
            <div className="mb-5">
              <Badge variant={badgeVariant(product.category)} />
            </div>

            {/* Nama motif — heading utama halaman ini */}
            <h1 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-3">
              {product.motif}
            </h1>

            {/* BuildingStory — konteks narasi */}
            <p className="font-sans text-sm text-stone italic leading-relaxed mb-6">
              {product.buildingStory}
            </p>

            {/* Foto bangunan placeholder (kecil) */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-20 h-16 bg-sand rounded-sm flex-none"
                role="img"
                aria-label={`Foto bangunan ${product.buildingFull}`}
              />
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-stone mb-0.5">
                  Bangunan asli
                </p>
                <p className="font-sans text-xs text-ink leading-snug">
                  {product.buildingFull}
                </p>
                {product.buildingBuilt && (
                  <p className="font-sans text-[10px] text-stone mt-0.5">
                    Dibangun {product.buildingBuilt}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-sand mb-6" />

            {/* Detail produk — format label-value */}
            <dl className="space-y-3 mb-6">
              <div className="flex justify-between font-sans text-sm">
                <dt className="text-stone">Produk</dt>
                <dd className="text-ink text-right">{product.name}</dd>
              </div>
              <div className="flex justify-between font-sans text-sm">
                <dt className="text-stone">Material</dt>
                <dd className="text-ink">{product.material}</dd>
              </div>
              <div className="flex justify-between font-sans text-sm">
                <dt className="text-stone">Ukuran</dt>
                <dd className="text-ink">{product.dimensions}</dd>
              </div>
              {!product.inStock && (
                <div className="flex justify-between font-sans text-sm">
                  <dt className="text-stone">Ketersediaan</dt>
                  <dd className="text-stone italic">Stok habis</dd>
                </div>
              )}
            </dl>

            {/* Divider */}
            <div className="border-t border-sand mb-6" />

            {/* Harga + badge preorder */}
            <div className="flex items-baseline gap-3 flex-wrap mb-8">
              <span className="font-sans text-xl text-ink">
                {formatPrice(product.price)}
              </span>
              {product.isPreorder && product.priceNote && (
                <Badge variant="default">{product.priceNote}</Badge>
              )}
              {!product.isPreorder && !product.inStock && (
                <Badge variant="default">Stok habis</Badge>
              )}
            </div>

            {/* CTA — WhatsApp dengan pesan pre-filled */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'primary', size: 'md' })}
            >
              Pesan Kain Ini
            </a>

          </div>
        </div>

      </div>
    </div>
  )
}
