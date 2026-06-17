import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
}

/*
  Komponen card produk reusable.
  Animasi (motion wrapper) ditangani oleh parent — Home stagger per kartu,
  CatalogGrid fade seluruh grid saat filter berubah.
*/
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/catalog/${product.slug}`} className="group block">

      {/* Image placeholder — ganti dengan <Image> saat foto tersedia */}
      <div className="w-full aspect-square bg-sand rounded-sm mb-5 overflow-hidden" />

      {/* Badge kategori */}
      <div className="mb-3">
        <Badge
          variant={
            product.category === 'batik-tulis'
              ? 'tulis'
              : product.category === 'batik-cap'
                ? 'cap'
                : 'lain'
          }
        />
      </div>

      {/*
        Hierarki visual wajib:
        1. Motif (nama bangunan)  — paling besar, serif
        2. buildingStory          — italic, stone, kontekstual
        3. Harga                  — terkecil, detail sekunder
      */}
      <p className="font-serif text-xl text-ink leading-snug mb-2 group-hover:text-brown transition-colors duration-300">
        {product.motif}
      </p>

      <p className="font-sans text-sm text-stone italic leading-relaxed mb-4">
        {product.buildingStory}
      </p>

      <div className="flex items-baseline gap-2">
        <span className="font-sans text-sm text-ink">
          {formatPrice(product.price)}
        </span>
        {product.priceNote && (
          <span className="font-sans text-xs text-stone">
            · {product.priceNote}
          </span>
        )}
      </div>

    </Link>
  )
}
