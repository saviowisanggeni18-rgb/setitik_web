import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="font-sans text-xs uppercase tracking-[0.3em] text-stone mb-8">404</p>
      <h1 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight max-w-md">
        Seperti bangunan cagar budaya yang belum terdokumentasikan —
      </h1>
      <p className="font-sans text-base text-stone mb-12 max-w-sm leading-relaxed">
        halaman ini belum ada. Tapi ceritanya mungkin sedang menunggu untuk ditulis.
      </p>
      <Link
        href="/"
        className="font-sans text-sm tracking-wide bg-brown text-silk px-8 py-3 hover:bg-forest transition-colors duration-500"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  )
}
