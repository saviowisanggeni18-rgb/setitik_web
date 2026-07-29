import { bucketName, getSupabaseAdmin } from '@/lib/site-updates'

export type MbatikImage = { src: string; positionX: number; positionY: number; zoom: number }
export type MbatikGalleryItem = {
  id: string
  eyebrow: string
  title: string
  description: string
  image: MbatikImage
}
export type MbatikPageContent = {
  heroEyebrow: string
  heroTitle: string
  heroAccent: string
  heroDescription: string
  heroImage: MbatikImage
  registrationImage: MbatikImage
  galleryEyebrow: string
  galleryTitle: string
  galleryDescription: string
  galleryItems: MbatikGalleryItem[]
}

const configPath = 'admin/mbatik-page-content.png'
const image = (src: string, positionX = 50, positionY = 50): MbatikImage => ({ src, positionX, positionY, zoom: 1 })

export const defaultMbatikPageContent: MbatikPageContent = {
  heroEyebrow: 'Kegiatan Setitik',
  heroTitle: 'Mbatik Bareng,',
  heroAccent: 'di jalanan Kota Lama.',
  heroDescription: 'Ruang belajar membatik bersama Setitik di tepi jalan Kota Lama Semarang. Peserta tidak perlu memiliki pengalaman membatik sebelumnya.',
  heroImage: image('/images/mbatik-bareng/mbatik-jalanan-02.webp'),
  registrationImage: image('/images/mbatik-bareng/mbatik-jalanan-05.webp'),
  galleryEyebrow: 'Dokumentasi',
  galleryTitle: 'Suasana Mbatik di Jalanan',
  galleryDescription: 'Dari teras bangunan tua, kain display, sampai peserta yang duduk melingkar, Mbatik Bareng dibuat sebagai ruang belajar yang dekat dengan kota.',
  galleryItems: [
    ['/images/mbatik-bareng/mbatik-jalanan-02.webp', 'Belajar di teras kota'],
    ['/images/mbatik-bareng/mbatik-jalanan-01.webp', 'Kota Lama sebagai ruang belajar'],
    ['/images/mbatik-bareng/mbatik-jalanan-03.webp', 'Mengenal canting dan malam'],
    ['/images/mbatik-bareng/mbatik-jalanan-04.webp', 'Membatik di bawah cahaya sore'],
    ['/images/mbatik-bareng/mbatik-jalanan-05.webp', 'Motif Setitik hadir di jalanan'],
    ['/images/mbatik-bareng/membatik-bersama-01.webp', 'Proses kecil yang saling dibantu'],
  ].map(([src, title], index) => ({
    id: `gallery-${index + 1}`,
    eyebrow: `Dokumentasi ${String(index + 1).padStart(2, '0')}`,
    title,
    description: 'Bagian dari suasana Mbatik di Jalanan, ruang belajar terbuka yang mempertemukan proses membatik, peserta, dan bangunan Kota Lama.',
    image: image(src),
  })),
}

function mergeImage(value: Partial<MbatikImage> | undefined, fallback: MbatikImage): MbatikImage {
  return { ...fallback, ...value, src: value?.src || fallback.src }
}

export function normalizeMbatikContent(value?: Partial<MbatikPageContent>): MbatikPageContent {
  const base = defaultMbatikPageContent
  return {
    ...base,
    ...value,
    heroImage: mergeImage(value?.heroImage, base.heroImage),
    registrationImage: mergeImage(value?.registrationImage, base.registrationImage),
    galleryItems: Array.isArray(value?.galleryItems)
      ? value.galleryItems.map((item, index) => ({
          ...base.galleryItems[index % base.galleryItems.length],
          ...item,
          id: item.id || `gallery-${Date.now()}-${index}`,
          image: mergeImage(item.image, base.galleryItems[index % base.galleryItems.length].image),
        }))
      : base.galleryItems,
  }
}

export async function loadMbatikPageContent() {
  const supabase = getSupabaseAdmin()
  if (!supabase) return defaultMbatikPageContent
  const { data, error } = await supabase.storage.from(bucketName).download(configPath)
  if (error || !data) return defaultMbatikPageContent
  try { return normalizeMbatikContent(JSON.parse(await data.text())) } catch { return defaultMbatikPageContent }
}

export async function saveMbatikPageContent(content: MbatikPageContent) {
  const supabase = getSupabaseAdmin()
  if (!supabase) throw new Error('Supabase admin belum dikonfigurasi.')
  const { error } = await supabase.storage.from(bucketName).upload(
    configPath,
    new Blob([JSON.stringify(normalizeMbatikContent(content))], { type: 'image/png' }),
    { contentType: 'image/png', upsert: true },
  )
  if (error) throw new Error(error.message)
}
