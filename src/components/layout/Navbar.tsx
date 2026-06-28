'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/catalog', label: 'Koleksi' },
  { href: '/about', label: 'Tentang' },
  { href: '/impact', label: 'Dampak' },
  { href: '/mbatik-bareng', label: 'Mbatik Bareng' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif text-xl text-ink tracking-wide hover:text-brown transition-colors duration-300"
          onClick={() => setOpen(false)}
        >
          <span
            className="flex-none w-8 h-8 rounded-full border border-sand bg-sand/20"
            aria-hidden="true"
          />
          Setitik
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'font-sans text-sm tracking-wide transition-colors duration-300',
                  mounted && (pathname === href || pathname.startsWith(href + '/'))
                    ? 'text-brown'
                    : 'text-stone hover:text-ink'
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-ink p-1"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-sand bg-cream">
          <ul className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-5">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'font-sans text-base tracking-wide transition-colors duration-300',
                    pathname === href || pathname.startsWith(href + '/')
                      ? 'text-brown'
                      : 'text-stone hover:text-ink'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
