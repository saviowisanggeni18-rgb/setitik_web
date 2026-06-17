# CLAUDE.md — Setitik Cultureware Website

Baca file ini sebelum menulis satu baris kode pun.
Untuk konteks brand dan keputusan desain yang lebih dalam, baca juga `docs/BRIEF.md`.

---

## Apa Ini

Website digitalisasi untuk **Setitik Cultureware** — UMKM batik berbasis cagar budaya dari Semarang.
Ini bukan e-commerce biasa. Ini adalah **digital heritage experience**: story-driven, elegan, minimalis.
Setiap keputusan teknis harus melayani pengalaman bercerita, bukan kemudahan transaksi.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS v3 |
| Animasi | Framer Motion |
| Font | Playfair Display (heading) + Inter (body) via `next/font/google` |
| Form | React Hook Form |
| Icons | Lucide React |
| Bahasa | TypeScript |

**Tidak ada** UI library eksternal (shadcn, MUI, dll) — semua komponen dibangun dari scratch sesuai design system.

---

## Struktur Folder

```
src/
├── app/
│   ├── layout.tsx                  # Root layout: Navbar + Footer + font vars
│   ├── page.tsx                    # Home
│   ├── catalog/
│   │   ├── page.tsx                # Catalog index (grid produk)
│   │   └── [slug]/page.tsx         # Detail produk
│   ├── story/page.tsx              # Perjalanan & narasi brand
│   ├── about/page.tsx              # Founder + visi misi + kolaborasi
│   ├── impact/page.tsx             # Dampak sosial & budaya
│   └── mbatik-bareng/page.tsx      # Pendaftaran kegiatan
├── components/
│   ├── ui/                         # Atom: Button, Badge, Input, Textarea
│   ├── sections/                   # Molekul: HeroSection, ProductCard, TimelineItem, StoryChapter
│   └── layout/                     # Organisme: Navbar, Footer, PageTransition
├── data/
│   ├── products.ts                 # Data produk statis (typed)
│   └── events.ts                   # Jadwal Mbatik Bareng
├── lib/
│   └── utils.ts                    # cn() helper + utilities
├── styles/
│   └── globals.css                 # CSS custom properties + base
└── public/
    └── images/                     # Semua aset gambar lokal
```

---

## Design System

### Palet Warna (CSS Custom Properties)

Definisikan di `globals.css` dan gunakan via Tailwind arbitrary values atau langsung via CSS var:

```css
:root {
  --color-bg-primary:    #F5F0E8;  /* krem gading — background utama */
  --color-bg-secondary:  #FDFAF5;  /* putih sutra — card & section terang */
  --color-accent-brown:  #8B6B3D;  /* coklat batik — aksen primer */
  --color-accent-green:  #2C3E30;  /* hijau tua — aksen sekunder */
  --color-text-primary:  #1A1512;  /* hitam cengkeh */
  --color-text-muted:    #6B5F52;  /* abu coklat — caption, label */
  --color-border:        #D9D0C1;  /* border halus */
}
```

Tambahkan di `tailwind.config.ts`:
```ts
colors: {
  'bg-primary':   'var(--color-bg-primary)',
  'bg-secondary': 'var(--color-bg-secondary)',
  'accent-brown': 'var(--color-accent-brown)',
  'accent-green': 'var(--color-accent-green)',
  'text-primary': 'var(--color-text-primary)',
  'text-muted':   'var(--color-text-muted)',
  'border-soft':  'var(--color-border)',
}
```

### Tipografi

```ts
// app/layout.tsx
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
```

Aturan:
- `font-serif` → heading, quote, nama produk
- `font-sans` → body, label, navigasi, form
- Heading scale: `text-5xl` → `text-7xl` (hero), `text-3xl` → `text-4xl` (section), `text-xl` → `text-2xl` (card)
- Line-height heading: `leading-tight` atau `leading-[1.1]`
- Jangan gunakan `font-bold` untuk heading serif — gunakan `font-normal` atau `font-medium`, serif sudah terasa berat secara visual

### Spacing

- Section padding vertikal minimum: `py-24` (96px) — jangan kurang dari ini
- Container max-width: `max-w-6xl mx-auto px-6`
- Gap antar section: `space-y-32` atau `gap-32`
- Whitespace adalah kemewahan — jangan takut halaman terasa "kosong"

### Animasi (Framer Motion)

Gunakan `fadeInUp` yang lambat dan tenang:
```ts
export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
}
```
- Durasi minimum: `0.6s` — jangan lebih cepat dari ini
- Easing: `ease-out` atau custom cubic-bezier di atas
- Gunakan `viewport={{ once: true }}` agar animasi hanya trigger sekali

---

## Konvensi Komponen

### Penamaan
- Component files: `PascalCase.tsx` → `ProductCard.tsx`, `HeroSection.tsx`
- Page files: `page.tsx` (Next.js convention)
- Data files: `camelCase.ts` → `products.ts`
- CSS classes: Tailwind utility, tidak ada custom class kecuali di `globals.css`

### Pola Komponen

```tsx
// Selalu typed props
interface ProductCardProps {
  slug: string
  name: string
  motif: string          // nama bangunan cagar budaya
  buildingStory: string  // satu kalimat cerita bangunan
  price: number
  category: 'tulis' | 'cap'
  image: string
}

export default function ProductCard({ slug, name, motif, buildingStory, price, category, image }: ProductCardProps) {
  // ...
}
```

### cn() Helper

Selalu gunakan `cn()` untuk conditional classes:
```ts
// lib/utils.ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Data Struktur

### products.ts

```ts
export interface Product {
  slug: string
  name: string
  category: 'batik-tulis' | 'batik-cap' | 'produk-lain'
  subcategory: string          // 'kain-panjang' | 'taplak' | 'sarung-bantal' | 'jarik' | 'outer' | dll
  motif: string                // nama motif bangunan, misal: 'Gereja Blenduk'
  buildingFull: string         // nama lengkap bangunan
  buildingStory: string        // satu kalimat italic tentang bangunan
  buildingBuilt?: string       // tahun dibangun (opsional)
  price: number
  priceNote?: string           // misal: 'Pre-order · 2–3 bulan'
  dimensions: string           // misal: '115 x 225 cm'
  material: string             // misal: 'Katun Primis'
  image: string                // path ke /public/images/
  buildingImage?: string       // foto bangunan asli
  isPreorder: boolean
  inStock: boolean
}
```

### events.ts

```ts
export interface Event {
  id: string
  date: string                 // ISO format
  displayDate: string          // 'Kamis, 17 Juli 2025'
  time: string                 // '09.00–12.00 WIB'
  location: string             // 'Taman Srigunting, Kota Lama Semarang'
  totalSlots: number
  availableSlots: number
  status: 'open' | 'full' | 'coming-soon'
}
```

---

## Halaman & Tujuannya

| Halaman | Tujuan utama | Jangan lakukan |
|---|---|---|
| Home | Buat pengunjung berhenti & penasaran | Taruh CTA "Beli" di above the fold |
| Catalog | Jual produk tanpa terasa berjualan | Grid seragam tanpa konteks cerita |
| Story | Bangun hubungan emosional | Timeline generik tanpa narasi sastra |
| About | Legitimasi lewat founder & klien | Halaman korporat yang dingin |
| Impact | Buktikan membeli = berpartisipasi budaya | Data tanpa wajah manusia di baliknya |
| Mbatik Bareng | Undang partisipasi langsung | Form yang terasa seperti formulir birokrasi |

---

## CTA Language

Jangan gunakan bahasa transaksional generik. Gunakan bahasa yang mengundang:

| ❌ Hindari | ✅ Gunakan |
|---|---|
| Beli Sekarang | Pesan Kain Ini |
| Submit | Daftarkan Diri |
| Add to Cart | Simpan ke Pilihan |
| Learn More | Baca Ceritanya |
| Shop Now | Jelajahi Koleksi |
| Register | Saya Ikut Mbatik |

---

## Gambar

- **Sumber awal**: ekstrak dari file `Katalog_Produk_Setitik_2026.docx` — gambar produk, bangunan, proses desain
- Simpan di `public/images/products/`, `public/images/buildings/`, `public/images/process/`
- Format: WebP diutamakan, fallback JPG
- Selalu gunakan `next/image` dengan `alt` yang deskriptif dan bermakna
- Untuk placeholder sementara, gunakan warna solid `bg-[#D9D0C1]` — bukan gambar placeholder generik

---

## Hal yang Tidak Boleh Dilakukan

- ❌ Jangan install UI library (shadcn, MUI, Chakra, Ant Design)
- ❌ Jangan gunakan `font-bold` pada heading serif
- ❌ Jangan buat section dengan `py` kurang dari `py-16`
- ❌ Jangan tampilkan harga sebagai elemen terbesar di card produk
- ❌ Jangan gunakan warna di luar palet yang sudah didefinisikan
- ❌ Jangan buat animasi dengan durasi di bawah `0.5s`
- ❌ Jangan tambahkan ornamen batik sebagai dekorasi background — ini klise
- ❌ Jangan buat navbar dengan mega-menu atau dropdown berlapis

---

## Urutan Pengerjaan yang Disarankan

1. Setup project + install dependencies
2. `tailwind.config.ts` + `globals.css` (design tokens)
3. `layout.tsx` — Navbar + Footer
4. Komponen `ui/Button.tsx` + `ui/Badge.tsx`
5. `HeroSection.tsx` — paling krusial, menentukan feel keseluruhan
6. `ProductCard.tsx` — komponen paling sering dipakai
7. Page `Home` — assembly komponen
8. Page `Catalog` — grid + filter
9. Page `Mbatik Bareng` — form pendaftaran
10. Page `Story` — timeline + chapter
11. Page `About` + `Impact`

---

*Untuk konteks brand lengkap, filosofi desain, analisis referensi, dan keputusan UX: baca `docs/BRIEF.md`*
