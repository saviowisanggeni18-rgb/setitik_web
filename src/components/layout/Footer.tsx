import Link from 'next/link'

const footerLinks = [
  { href: '/catalog', label: 'Koleksi' },
  { href: '/story', label: 'Kisah Kami' },
  { href: '/about', label: 'Tentang' },
  { href: '/impact', label: 'Dampak' },
  { href: '/mbatik-bareng', label: 'Mbatik Bareng' },
]

export default function Footer() {
  return (
    <footer className="bg-forest text-silk/80">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-serif text-2xl text-silk mb-3">Setitik</p>
            <p className="font-sans text-sm leading-relaxed text-silk/60 max-w-xs">
              Setitik demi setitik, menjadi semakin berarti.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-silk/40 mb-5">
              Navigasi
            </p>
            <ul className="space-y-3">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-sm text-silk/70 hover:text-silk transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-silk/40 mb-5">
              Kontak
            </p>
            <ul className="space-y-3 font-sans text-sm text-silk/70">
              <li>
                <a
                  href="mailto:setitikcultureware@gmail.com"
                  className="hover:text-silk transition-colors duration-300"
                >
                  setitikcultureware@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6282342303651"
                  className="hover:text-silk transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  0823 4230 3651
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/setitik.id"
                  className="hover:text-silk transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @setitik.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-silk/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-sans text-xs text-silk/30">
            © {new Date().getFullYear()} Setitik Cultureware. Kota Lama, Semarang.
          </p>
          <p className="font-sans text-xs text-silk/30">
            Mendokumentasikan cagar budaya, satu motif setiap saat.
          </p>
        </div>
      </div>
    </footer>
  )
}
