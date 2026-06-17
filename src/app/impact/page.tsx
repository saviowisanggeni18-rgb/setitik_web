import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dampak',
  description: 'Dampak sosial dan budaya Setitik Cultureware — pemberdayaan komunitas dan pelestarian cagar budaya.',
}

const stats = [
  { number: '11+', label: 'Bangunan cagar budaya terdokumentasikan' },
  { number: '3', label: 'Kota warisan Heritage Travel Journal' },
  { number: '2019', label: 'Tahun berdiri, Kota Lama Semarang' },
  { number: '8+', label: 'Mitra institusional internasional' },
]

export default function ImpactPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4">Dampak</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight max-w-2xl">
          Membeli adalah<br />berpartisipasi budaya.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-24">
          Setiap produk Setitik membawa dampak yang melampaui transaksi —
          mendokumentasikan warisan, memberdayakan komunitas, dan menjaga
          agar cagar budaya tetap relevan di hari ini.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-sand mb-24">
          {stats.map(({ number, label }) => (
            <div key={label} className="px-8 py-10 text-center">
              <p className="font-serif text-4xl text-brown mb-3">{number}</p>
              <p className="font-sans text-xs text-stone leading-relaxed">{label}</p>
            </div>
          ))}
        </div>

        {/* Lapas story */}
        <div className="max-w-3xl mx-auto bg-silk border border-sand px-10 py-12 mb-24">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-6">
            Kolaborasi Lapas 2A Ambarawa
          </p>
          <blockquote className="font-serif text-xl md:text-2xl text-ink leading-relaxed">
            &ldquo;Diproduksi oleh bapak-bapak yang terbelenggu besi penyekat,
            namun semangat serta mimpinya tak dapat dipenjara.&rdquo;
          </blockquote>
          <p className="font-sans text-sm text-stone mt-6 leading-relaxed">
            Motif Benteng Willem I lahir dari kolaborasi unik dengan Lapas 2A Ambarawa —
            sebuah bangunan cagar budaya yang kini berfungsi sebagai lembaga pemasyarakatan.
            Para warga binaan menjadi pembatik, mengubah keahlian baru menjadi karya yang
            bermakna dan berdampak.
          </p>
        </div>

        {/* Social programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="w-full aspect-video bg-sand rounded-sm mb-6" />
            <h2 className="font-serif text-xl text-ink mb-3">Pemberdayaan Ibu-ibu</h2>
            <p className="font-sans text-sm text-stone leading-relaxed">
              Ibu-ibu buruh pabrik di sekitar Kabupaten Semarang yang terdampak pandemi
              dilatih mengolah kain batik menjadi produk siap pakai — menciptakan sumber
              penghasilan baru yang berkelanjutan.
            </p>
          </div>
          <div>
            <div className="w-full aspect-video bg-sand rounded-sm mb-6" />
            <h2 className="font-serif text-xl text-ink mb-3">Pelestarian Kampung Batik</h2>
            <p className="font-sans text-sm text-stone leading-relaxed">
              Kampung batik Semarang dekat Kota Lama — jumlah pembatik tulisnya semakin
              berkurang dari tahun ke tahun. Setitik menjadikan mereka mitra utama,
              memastikan keahlian ini tidak ikut menghilang.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
