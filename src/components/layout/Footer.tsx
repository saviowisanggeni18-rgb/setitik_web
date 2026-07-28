import { AtSign, Mail, Phone, Store } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest text-silk">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          <div className="md:col-span-1">
            <img
              src="/images/brand/setitik-wordmark.png"
              alt="Setitik"
              className="mb-4 h-12 w-auto brightness-0 invert"
            />
            <p className="max-w-xs font-sans text-sm font-medium leading-relaxed text-silk">
              Setitik demi setitik, menjadi semakin berarti.
            </p>
          </div>

          <div>
            <p className="mb-5 font-sans text-xs uppercase tracking-widest text-cream">
              Contact Person
            </p>
            <ul className="space-y-3 font-sans text-sm font-semibold tracking-[0.04em] text-silk">
              <li>
                <a
                  href="tel:+6281802444243"
                  className="flex items-center gap-3 transition-colors duration-300 hover:text-cream"
                >
                  <Phone size={18} aria-hidden />
                  081802444243
                </a>
              </li>
              <li>
                <a
                  href="mailto:setitikcultureware@gmail.com"
                  className="flex items-center gap-3 transition-colors duration-300 hover:text-cream"
                >
                  <Mail size={18} aria-hidden />
                  setitikcultureware@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 font-sans text-xs uppercase tracking-widest text-cream">
              Social Media
            </p>
            <ul className="space-y-3 font-sans text-sm font-semibold tracking-[0.04em] text-silk">
              <li>
                <a
                  href="https://instagram.com/setitik.id"
                  className="flex items-center gap-3 transition-colors duration-300 hover:text-cream"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AtSign size={18} aria-hidden />
                  @setitik.id
                </a>
              </li>
              <li>
                <a
                  href="https://www.tokopedia.com/setitikcultureware"
                  className="flex items-center gap-3 transition-colors duration-300 hover:text-cream"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Store size={18} aria-hidden />
                  Setitik Cultureware
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-sand pt-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="font-sans text-xs text-silk">
              &copy; {new Date().getFullYear()} Setitik Cultureware. Kota Lama, Semarang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
