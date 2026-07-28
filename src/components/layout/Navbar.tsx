'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home', note: 'Halaman awal' },
  { href: '/catalog', label: 'Belanja', note: 'Produk Setitik' },
  { href: '/about', label: 'Tentang', note: 'Cerita dan perjalanan' },
  { href: '/impact', label: 'Dampak', note: 'Warisan dan komunitas' },
  { href: '/mbatik-bareng', label: 'Mbatik Bareng', note: 'Jadwal dan pendaftaran' },
] as const

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-sand bg-silk">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-5"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/setitik-wordmark.png"
            alt="Setitik"
            className="h-10 w-auto"
          />
          <span className="hidden h-7 w-px bg-sand lg:block" />
          <span className="hidden font-sans text-[8px] uppercase leading-relaxed tracking-[0.18em] text-stone lg:block">
            Cultureware
            <br />
            Semarang
          </span>
        </Link>

        <div className="hidden items-center rounded-full border border-sand bg-cream p-1.5 shadow-[0_8px_28px_rgba(68,52,34,0.08)] md:flex">
          {navLinks.map(({ href, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.13em] transition-colors duration-150 ${
                  active
                    ? 'bg-forest text-silk shadow-md'
                    : 'text-stone hover:bg-silk hover:text-ink'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-sand bg-cream text-ink transition-colors hover:border-brown hover:text-brown md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-navigation"
          className="overflow-hidden border-t border-sand bg-forest text-silk md:hidden"
        >
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans text-[8px] uppercase tracking-[0.22em] text-silk">
                Navigasi
              </p>
              <p className="font-sans text-[8px] uppercase tracking-[0.18em] text-brown">
                Setitik Cultureware
              </p>
            </div>

            <ul>
              {navLinks.map(({ href, label, note }, index) => {
                const active = isActive(href)
                return (
                  <li key={href} className="border-t border-silk/12">
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-4 py-5"
                    >
                      <span
                        className={`font-sans text-[9px] tracking-[0.14em] ${
                          active ? 'text-brown' : 'text-silk'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif text-2xl text-silk">
                          {label}
                        </span>
                        <span className="mt-1 block font-sans text-[10px] text-silk">
                          {note}
                        </span>
                      </span>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                          active
                            ? 'border-brown bg-brown text-silk'
                            : 'border-silk text-silk group-hover:border-brown group-hover:text-brown'
                        }`}
                      >
                        <ArrowUpRight size={14} aria-hidden />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
