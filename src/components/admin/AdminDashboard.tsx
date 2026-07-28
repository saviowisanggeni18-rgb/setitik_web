'use client'

import { FormEvent, useEffect, useState } from 'react'
import { FileSpreadsheet, Info, LayoutDashboard, Lock, LogOut, Package, Sparkles, Users } from 'lucide-react'
import HomepageSectionManager from '@/components/admin/HomepageSectionManager'
import ReportsPanel from '@/components/admin/ReportsPanel'
import UpdateManager from '@/components/admin/UpdateManager'
import CatalogProductManager from '@/components/admin/CatalogProductManager'

type Tab = 'homepage' | 'catalog' | 'about' | 'impact' | 'mbatik' | 'reports'

const tabs: Array<{
  id: Tab
  label: string
  description: string
}> = [
  {
    id: 'homepage',
    label: 'Editor Home',
    description: 'Tambah, susun, dan tampilkan bagian Home',
  },
  { id: 'catalog', label: 'Editor Belanja', description: 'Kelola produk dan katalog' },
  { id: 'about', label: 'Editor Tentang', description: 'Edit tampilan halaman Tentang' },
  { id: 'impact', label: 'Editor Dampak', description: 'Edit tampilan halaman Dampak' },
  { id: 'mbatik', label: 'Editor Mbatik Bareng', description: 'Kelola jadwal dan kegiatan' },
  {
    id: 'reports',
    label: 'Laporan',
    description: 'Buka laporan pendaftaran',
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('homepage')
  const [draftPassword, setDraftPassword] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setPassword(window.sessionStorage.getItem('setitik-admin-password') ?? '')
    }, 0)

    return () => window.clearTimeout(loadTimer)
  }, [])

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = draftPassword.trim()

    if (!value) return

    setPassword(value)
    window.sessionStorage.setItem('setitik-admin-password', value)
  }

  function handleLogout() {
    setPassword('')
    setDraftPassword('')
    window.sessionStorage.removeItem('setitik-admin-password')
  }

  if (!password) {
    return (
      <section className="min-h-[72vh] bg-cream px-4 py-12 text-ink sm:px-6 lg:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-brown">
              <span className="h-px w-9 bg-brown" />
              Admin Setitik
            </p>
            <h1 className="max-w-xl font-serif text-4xl leading-[1.02] text-ink sm:text-5xl md:text-6xl">
              Masuk untuk mengelola konten website.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-stone md:text-base">
              Panel ini dibuat untuk pekerjaan harian: menerbitkan kabar, mengatur bagian
              beranda, dan menyembunyikan konten yang belum siap tampil.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="border border-sand bg-silk p-6 shadow-[0_20px_70px_rgba(63,47,27,0.09)] sm:p-8"
          >
            <div className="mb-6 flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest text-silk">
                <Lock size={19} aria-hidden />
              </span>
              <div>
                <p className="font-serif text-3xl leading-tight text-ink">Password admin</p>
                <p className="mt-2 text-sm leading-7 text-stone">
                  Gunakan password yang sudah diisi di file environment.
                </p>
              </div>
            </div>

            <label className="grid gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                Password
              </span>
              <input
                type="password"
                value={draftPassword}
                onChange={(event) => setDraftPassword(event.target.value)}
                className="h-13 border border-sand bg-cream px-4 text-base outline-none transition focus:border-brown"
                placeholder="Masukkan password admin"
                autoFocus
              />
            </label>

            <button
              type="submit"
              disabled={!draftPassword.trim()}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-forest px-5 text-sm font-semibold text-silk transition hover:bg-brown disabled:pointer-events-none disabled:opacity-45"
            >
              Masuk ke Admin
            </button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cream px-4 py-8 text-ink sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-5 border-b border-sand pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-brown">
              <span className="h-px w-9 bg-brown" />
              Admin Setitik
            </p>
            <h1 className="font-serif text-4xl leading-[1.04] text-ink sm:text-5xl">
              Panel konten website.
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center gap-2 border border-sand bg-silk px-4 text-sm font-semibold text-stone transition hover:border-brown hover:text-brown lg:self-start"
          >
            <LogOut size={16} aria-hidden />
            Keluar
          </button>
        </div>

        <div className="mb-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tabs.map((tab) => {
            const active = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-24 items-center gap-4 border px-5 py-4 text-left transition ${
                  active
                    ? 'border-forest bg-forest text-silk shadow-[0_18px_42px_rgba(44,62,48,0.16)]'
                    : 'border-sand bg-silk text-ink hover:border-brown'
                }`}
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border ${
                    active ? 'border-silk/25 bg-silk/8' : 'border-sand bg-cream text-brown'
                  }`}
                >
                  {tab.id === 'homepage' ? (
                    <LayoutDashboard size={19} aria-hidden />
                  ) : tab.id === 'catalog' ? (
                    <Package size={19} aria-hidden />
                  ) : tab.id === 'about' ? (
                    <Info size={19} aria-hidden />
                  ) : tab.id === 'impact' ? (
                    <Sparkles size={19} aria-hidden />
                  ) : tab.id === 'mbatik' ? (
                    <Users size={19} aria-hidden />
                  ) : tab.id === 'reports' ? (
                    <FileSpreadsheet size={19} aria-hidden />
                  ) : null}
                </span>
                <span>
                  <span className="block font-serif text-2xl leading-tight">{tab.label}</span>
                  <span className={`mt-1 block text-sm ${active ? 'text-silk/68' : 'text-stone'}`}>
                    {tab.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {activeTab === 'homepage' ? (
          <HomepageSectionManager password={password} />
        ) : activeTab === 'catalog' ? (
          <CatalogProductManager password={password} />
        ) : activeTab === 'about' ? (
          <HomepageSectionManager password={password} page="about" />
        ) : activeTab === 'impact' ? (
          <HomepageSectionManager password={password} page="impact" />
        ) : activeTab === 'mbatik' ? (
          <UpdateManager password={password} initialTarget="mbatik" lockedTarget />
        ) : activeTab === 'reports' ? (
          <ReportsPanel password={password} />
        ) : null}
      </div>
    </section>
  )
}
