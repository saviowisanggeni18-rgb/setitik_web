import Image from 'next/image'

type EventImage = {
  src: string
  alt: string
  label: string
  position?: string
  fit?: 'cover' | 'contain'
  orientation?: 'portrait'
}

type EventGroup = {
  title: string
  year: string
  type: string
  description: string
  images: EventImage[]
}

const events: EventGroup[] = [
  {
    title: 'Canting Ajeg untuk Pembatik Pemula',
    year: 'Kolaborasi',
    type: 'Setitik × Reflective Undip',
    description:
      'Bersama Tim Reflective Undip, penerima Beasiswa Bakti BCA, Setitik mengembangkan Canting Ajeg yang berangkat dari pengalaman membatik bersama para pemula. Alat ini membantu menjaga aliran malam agar lebih terkendali dan mengurangi risiko tetesan jatuh ke kain, sehingga proses belajar membatik terasa lebih aman, nyaman, dan percaya diri.',
    images: [
      {
        src: '/images/collaborations/canting-otomasi-digunakan.jpeg',
        alt: 'Pemula menggunakan Canting Ajeg hasil kolaborasi Setitik dan Tim Reflective Undip',
        label: 'Uji penggunaan',
        position: 'center 48%',
      },
      {
        src: '/images/collaborations/canting-otomasi-prototipe.jpeg',
        alt: 'Prototipe Canting Ajeg untuk membantu pembatik pemula mengendalikan aliran malam',
        label: 'Prototipe',
        position: 'center 52%',
      },
      {
        src: '/images/collaborations/canting-otomasi-detail.jpeg',
        alt: 'Detail rancangan Canting Ajeg hasil kolaborasi Setitik dan Tim Reflective Undip',
        label: 'Detail alat',
        position: 'center 46%',
      },
    ],
  },
  {
    title: 'Dari Sisa Malam Menjadi Cahaya Baru',
    year: 'Riset bersama',
    type: 'Setitik x Reflective Undip',
    description:
      'Sisa malam dari proses membatik sering kali berakhir sebagai limbah. Bersama Tim Reflective Undip, Setitik mengolahnya menjadi lilin yang dapat digunakan kembali. Kolaborasi ini menghadirkan cara sederhana untuk memberi nilai baru pada material tersisa sekaligus mendorong proses membatik yang lebih bijak terhadap lingkungan.',
    images: [
      {
        src: '/images/collaborations/lilin-limbah-malam-tampak-atas.jpeg',
        alt: 'Lilin hasil pengolahan limbah malam batik dilihat dari atas',
        label: 'Hasil pengolahan',
        position: 'center 50%',
      },
      {
        src: '/images/collaborations/lilin-limbah-malam-menyala.jpeg',
        alt: 'Lilin dari limbah malam batik saat dinyalakan',
        label: 'Uji nyala',
        position: 'center 55%',
        orientation: 'portrait',
      },
      {
        src: '/images/collaborations/lilin-limbah-malam-detail.jpeg',
        alt: 'Detail lilin hasil kolaborasi Setitik dan Tim Reflective Undip',
        label: 'Detail produk',
        position: 'center 48%',
        orientation: 'portrait',
      },
    ],
  },
  {
    title: 'Hainan Brocade and Embroidery World Culture Week',
    year: '2025',
    type: 'Presentasi & fashion show',
    description:
      'Setitik membawa cerita batik Indonesia dalam forum budaya internasional melalui presentasi dan peragaan wastra.',
    images: [
      {
        src: '/images/collaborations/hainan-2025-presentasi.webp',
        alt: 'Presentasi Indonesian Batik oleh Setitik di Hainan Brocade and Embroidery World Culture Week 2025',
        label: 'Presentasi',
        fit: 'contain',
      },
      {
        src: '/images/collaborations/hainan-2025-fashion-show-portrait.webp',
        alt: 'Fashion show Setitik di Hainan Brocade and Embroidery World Culture Week 2025',
        label: 'Fashion show',
        position: 'center 35%',
        orientation: 'portrait',
      },
    ],
  },
  {
    title: 'Malaysia-UNESCO Cooperation Programme',
    year: '2023',
    type: 'Pameran & presentasi',
    description:
      'Keikutsertaan Setitik dalam ruang pertukaran budaya, presentasi karya, dan pameran produk.',
    images: [
      {
        src: '/images/collaborations/mucp-2023-group.webp',
        alt: 'Foto bersama dalam MUCP 2023',
        label: 'Forum',
      },
      {
        src: '/images/collaborations/mucp-2023-presentasi.webp',
        alt: 'Presentasi dan penyerahan karya dalam MUCP 2023',
        label: 'Presentasi',
      },
      {
        src: '/images/collaborations/mucp-2023-pameran.webp',
        alt: 'Pameran produk Setitik dalam MUCP 2023',
        label: 'Pameran',
      },
    ],
  },
  {
    title: 'Kolaborasi x Hysteria x Sanggar Tari Greget',
    year: '2025',
    type: 'Kolaborasi seni pertunjukan',
    description:
      'Ruang temu antara motif, gerak, dan narasi kota melalui pertunjukan serta dokumentasi komunitas.',
    images: [
      {
        src: '/images/collaborations/hysteria-greget-2025-group.webp',
        alt: 'Foto bersama kolaborasi Setitik, Hysteria, dan Sanggar Tari Greget 2025',
        label: 'Dokumentasi',
      },
      {
        src: '/images/collaborations/hysteria-greget-2025-performance.webp',
        alt: 'Pertunjukan tari dalam kolaborasi Setitik, Hysteria, dan Sanggar Tari Greget 2025',
        label: 'Pertunjukan',
        position: 'center 25%',
      },
    ],
  },
  {
    title: 'Kolaborasi x Risa Maharani Fashion Designer',
    year: '2024',
    type: 'Eksplorasi busana',
    description:
      'Motif Setitik diolah dalam pendekatan fashion kontemporer bersama desainer Risa Maharani.',
    images: [
      {
        src: '/images/collaborations/risa-maharani-2024.webp',
        alt: 'Kolaborasi Setitik dengan Risa Maharani fashion designer 2024',
        label: 'Fashion',
        position: 'center 52%',
      },
    ],
  },
  {
    title: 'Seragam Distaru Kota Semarang',
    year: '2024',
    type: 'Klien institusional',
    description:
      'Motif Setitik hadir sebagai seragam yang dikenakan dalam kegiatan Distaru Kota Semarang.',
    images: [
      {
        src: '/images/collaborations/distaru-semarang-01.webp',
        alt: 'Seragam Distaru Kota Semarang karya Setitik',
        label: 'Seragam',
      },
      {
        src: '/images/collaborations/distaru-semarang-02.webp',
        alt: 'Tim Distaru Kota Semarang mengenakan seragam motif Setitik',
        label: 'Dokumentasi',
      },
    ],
  },
]

function Photo({
  image,
  className = '',
  priority = false,
}: {
  image: EventImage
  className?: string
  priority?: boolean
}) {
  const fitClass =
    image.fit === 'contain'
      ? 'object-contain'
      : 'object-cover'

  return (
    <figure className={`relative overflow-hidden bg-[#e7dac8] ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 45vw, 100vw"
        className={fitClass}
        style={{ objectPosition: image.position ?? 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#14251c]/55 via-transparent to-transparent" />
      <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#203829] shadow-sm backdrop-blur">
        {image.label}
      </span>
    </figure>
  )
}

function ArchiveCard({ event, index }: { event: EventGroup; index: number }) {
  const [main, ...supporting] = event.images
  const reversed = index % 2 === 1

  return (
    <article className="group overflow-hidden rounded-[2.25rem] border border-[#d8c8b3] bg-[#fbf7ef] shadow-[0_22px_70px_rgba(38,48,35,0.12)] transition duration-200 hover:shadow-[0_28px_76px_rgba(38,48,35,0.15)]">
      <div className={`grid gap-0 lg:grid-cols-[1.12fr_0.88fr] ${reversed ? 'lg:[&>div:first-child]:order-2' : ''}`}>
        <div className="bg-[#203829] p-2">
          <div className="grid gap-2">
            <Photo image={main} priority={index < 2} className="aspect-[16/9] rounded-[1.7rem]" />
            {supporting.length > 0 && (
              <div className={`grid gap-2 ${supporting.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {supporting.map((image) => (
                  <Photo
                    key={image.src}
                    image={image}
                    className={`${image.orientation === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/8.5]'} rounded-[1.15rem]`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex min-h-[360px] flex-col justify-between p-7 md:p-9 lg:p-10">
          <div className="relative z-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#9a743c]">
                <span className="h-px w-9 bg-[#9a743c]" />
                {event.type}
              </p>
              <span className="shrink-0 rounded-full border border-[#d8c8b3] px-3 py-1 font-serif text-lg leading-none text-[#9a743c]">
                {event.year}
              </span>
            </div>

            <h3 className="max-w-xl font-serif text-3xl leading-[1.03] text-[#211b16] md:text-5xl">
              {event.title}
            </h3>
          </div>

          <div className="relative z-10 mt-7 border-t border-[#dccbb5] pt-5">
            <p className="max-w-xl text-sm leading-7 text-[#70665c] md:text-base md:leading-8">{event.description}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function CollaborationEventsSection() {
  const [spotlight, ...archive] = events
  const spotlightSupportingImages = spotlight.images.slice(1)

  return (
    <section className="bg-[#f7f1e8] px-4 pb-12 pt-6 text-[#211b16] sm:px-6 md:pb-16 md:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-5 border-b border-[#d8c8b3] pb-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9a743c]">
              <span className="h-px w-9 bg-[#9a743c]" />
              Kolaborasi, acara, dan klien
            </p>
            <h2 className="max-w-3xl font-serif text-4xl leading-[0.98] sm:text-5xl md:text-6xl">
              Arsip visual Setitik di ruang budaya.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-8 text-[#70665c] md:text-base lg:ml-auto">
            Dokumentasi presentasi, fashion show, kolaborasi seni, seragam institusi, dan pameran.
            Semua ditata sebagai arsip acara yang jelas, rapi, dan mudah dibaca di desktop maupun HP.
          </p>
        </div>

        <article className="rounded-[2.25rem] bg-[#203829] p-3 text-white shadow-[0_30px_90px_rgba(32,56,41,0.22)] sm:p-5 lg:p-7">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-center">
            <div className="group">
              <Photo
                image={spotlight.images[0]}
                priority
                className="aspect-[3/2] w-full rounded-[1.85rem] border border-white/10 shadow-[0_22px_60px_rgba(0,0,0,0.18)]"
              />
            </div>

            <div className="flex flex-col gap-6 px-1 pb-2 sm:px-2 lg:px-0 lg:py-3">
              <div>
                <p className="mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#d5b075]">
                  Spotlight {spotlight.year}
                </p>
                <h3 className="font-serif text-4xl leading-[1.02] sm:text-5xl lg:text-[3.15rem]">{spotlight.title}</h3>
                <p className="mt-6 text-sm leading-8 text-white/72 md:text-base">{spotlight.description}</p>
              </div>

              <div className={`grid gap-3 ${spotlightSupportingImages.length > 1 ? 'grid-cols-2' : ''}`}>
                {spotlightSupportingImages.map((image) => (
                  <Photo
                    key={image.src}
                    image={image}
                    className={`${
                      image.orientation === 'portrait'
                        ? 'mx-auto aspect-[4/5] w-full max-w-[16rem] sm:max-w-[18rem] lg:max-w-[17rem]'
                        : 'aspect-[4/3]'
                    } rounded-[1.25rem] border border-white/15`}
                  />
                ))}
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8 space-y-7">
          {archive.map((event, index) => (
            <ArchiveCard key={event.title} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
