import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kisah',
  description: 'Perjalanan Setitik Cultureware — dari bangunan cagar budaya ke helai kain batik.',
}

export default function StoryPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4">Kisah</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-10 leading-tight">
          Dari ornamen arsitektur<br />ke helai kain.
        </h1>

        {/* Timeline stub */}
        <div className="space-y-16">
          {[
            { year: '2019', title: 'Awal mula', body: 'Setitik lahir dari keprihatinan terhadap kawasan cagar budaya yang diperlakukan hanya sebagai objek wisata. Jessie Setiawati memulai perjalanan mendokumentasikan bangunan-bangunan Kota Lama ke dalam motif batik.' },
            { year: '2021', title: 'Pemberdayaan komunitas', body: 'Program pelatihan dimulai — ibu-ibu terdampak pandemi diajak mengolah kain menjadi produk jadi. Kegiatan Mbatik Bareng pertama kali digelar di Kota Lama.' },
            { year: '2022', title: 'Pengakuan internasional', body: 'Setitik menjadi bagian dari paket merchandise G20 dan dipercaya oleh UNESCO untuk Heritage Travel Journal edisi Tambang Batu Bara Ombilin Sawahlunto.' },
            { year: '2023', title: 'Kolaborasi lintas batas', body: 'ASEAN dan Malaysia UNESCO Cooperation Programme menjadi mitra. Motif Benteng Willem I lahir dari kolaborasi dengan Lapas 2A Ambarawa.' },
          ].map(({ year, title, body }) => (
            <div key={year} className="grid grid-cols-[80px_1fr] gap-8">
              <p className="font-serif text-2xl text-brown pt-1">{year}</p>
              <div>
                <h2 className="font-serif text-xl text-ink mb-3">{title}</h2>
                <p className="font-sans text-sm text-stone leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
