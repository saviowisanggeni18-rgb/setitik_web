import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tentang',
  description: 'Tentang Setitik Cultureware — founder, visi, dan klien institusional.',
}

const clients = [
  { name: 'UNESCO', year: '2022–2023', note: 'Heritage Travel Journal' },
  { name: 'G20', year: '2022', note: 'Paket merchandise' },
  { name: 'ASEAN', year: '2023', note: 'Paket merchandise' },
  { name: 'Kemenparekraf', year: '2021', note: 'Paket merchandise' },
  { name: 'KTT', year: '2023', note: 'Paket merchandise' },
  { name: 'Malaysia UNESCO Cooperation Programme', year: '2023', note: 'Heritage Travel Journal' },
  { name: 'Sekolah Musik Indonesia', year: '—', note: 'Kain seragam motif batik' },
  { name: 'Viu', year: '2020', note: 'Paket merchandise' },
]

export default function AboutPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Founder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <div className="aspect-[3/4] bg-sand rounded-sm" />
          <div className="flex flex-col justify-center">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-6">Founder</p>
            <h1 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
              Jessie Setiawati
            </h1>
            <p className="font-sans text-sm text-stone leading-relaxed mb-6">
              Lahir dari kegelisahan melihat bangunan cagar budaya yang ada di sekitar kita
              diperlakukan hanya sebagai latar belakang foto. Jessie memulai Setitik pada 2019
              dengan satu keyakinan sederhana: bahwa setiap bangunan tua menyimpan cerita
              yang layak diabadikan — bukan di museum, tapi di atas kain yang bisa dipakai.
            </p>
            <p className="font-sans text-sm text-stone leading-relaxed">
              Sebagai pembatik tulis, ia memimpin proses dari observasi lapangan hingga
              helai kain jadi — memastikan setiap motif merupakan representasi yang
              setia dari arsitektur aslinya.
            </p>
          </div>
        </div>

        {/* Manifesto */}
        <div className="max-w-3xl mx-auto text-center mb-32">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-8">Visi</p>
          <p className="font-serif text-2xl md:text-3xl text-ink leading-relaxed">
            Bahwa setiap helai batik bisa menjadi jembatan antara masa lalu dan sekarang —
            antara bangunan yang berdiri kokoh di sudut kota dan tangan yang memakainya
            setiap hari.
          </p>
        </div>

        {/* Clients */}
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-8 text-center">
            Kepercayaan yang diberikan
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-sand">
            {clients.map(({ name, year, note }) => (
              <div key={name} className="px-8 py-6 border-b border-sand last:border-b-0 md:[&:nth-last-child(2)]:border-b-0">
                <p className="font-serif text-lg text-ink mb-1">{name}</p>
                <p className="font-sans text-xs text-stone">
                  {year} · {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
