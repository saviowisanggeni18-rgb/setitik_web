'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { HomepageSection } from '@/lib/homepage-sections'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
}

const impactStories = [
  {
    number: '01',
    label: 'Pemberdayaan',
    title: 'Pemberdayaan Ibu-ibu',
    image: '/images/mbatik-bareng/mbatik-jalanan-03.webp',
    position: 'center 72%',
    body: 'Ibu-ibu buruh pabrik di sekitar Kabupaten Semarang yang terdampak pandemi dilatih mengolah kain batik menjadi produk siap pakai, menciptakan sumber penghasilan baru.',
  },
  {
    number: '02',
    label: 'Pelestarian',
    title: 'Pelestarian Kampung Batik',
    image: '/images/editorial/founder-canting.webp',
    position: 'center',
    body: 'Pembatik tulis di Kampung Batik Semarang menjadi mitra utama Setitik agar keahlian yang jumlah pelakunya terus berkurang tetap hidup dan mendapat ruang.',
  },
  {
    number: '03',
    label: 'Kolaborasi',
    title: 'Motif Benteng Willem I',
    image: '/images/impact/motif-benteng-willem-1.jpeg',
    position: 'center 56%',
    body: 'Motif Benteng Willem I lahir dari kolaborasi dengan Lapas 2A Ambarawa. Warga binaan belajar membatik dan mengubah keahlian baru menjadi karya yang bermakna serta berdampak.',
  },
]

const impactFlow = [
  {
    title: 'Belajar',
    body: 'Pelatihan membatik dan pendampingan proses produksi.',
  },
  {
    title: 'Mengolah',
    body: 'Kain dan motif cagar budaya diterjemahkan menjadi produk siap pakai.',
  },
  {
    title: 'Menghidupkan',
    body: 'Keterampilan, cerita bangunan, dan peluang kerja terus bergerak bersama komunitas.',
  },
]

type ImpactImageState = { src: string; positionX: number; positionY: number; zoom: number }
const impactContentMarker = '__SETITIK_IMPACT_CONTENT__:'
const defaultImpactDescription = 'Setitik bekerja bersama komunitas dan pengrajin agar pelestarian budaya juga menghasilkan manfaat ekonomi yang nyata.'

function readImpactContent(section?: HomepageSection) {
  const raw = section?.description ?? ''
  if (raw.startsWith(impactContentMarker)) {
    try {
      const parsed = JSON.parse(raw.slice(impactContentMarker.length)) as { description?: string; images?: Record<string, ImpactImageState> }
      return { description: parsed.description || defaultImpactDescription, images: parsed.images || {} }
    } catch {}
  }
  return { description: raw.trim() || defaultImpactDescription, images: {} as Record<string, ImpactImageState> }
}

function ImpactEditableImage({ image, alt, editing, compact = false, onChange, onUpload }: { image: ImpactImageState; alt: string; editing: boolean; compact?: boolean; onChange: (value: ImpactImageState) => void; onUpload?: (file: File) => Promise<string> }) {
  const dragRef = useRef<{ x: number; y: number; positionX: number; positionY: number } | null>(null)
  return <div className={`absolute inset-0 overflow-hidden ${editing ? 'cursor-grab touch-none overscroll-contain active:cursor-grabbing' : ''}`} onWheel={(event) => { if (!editing) return; event.preventDefault(); event.stopPropagation(); const zoom = Math.min(3, Math.max(1, image.zoom + (event.deltaY < 0 ? 0.1 : -0.1))); onChange({ ...image, zoom: Number(zoom.toFixed(2)) }) }} onPointerDown={(event) => { if (!editing || (event.target as Element).closest('label,input')) return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { x: event.clientX, y: event.clientY, positionX: image.positionX, positionY: image.positionY } }} onPointerMove={(event) => { const drag = dragRef.current; if (!drag || !editing) return; const bounds = event.currentTarget.getBoundingClientRect(); onChange({ ...image, positionX: Number(Math.min(100, Math.max(0, drag.positionX - ((event.clientX - drag.x) / bounds.width) * 100)).toFixed(1)), positionY: Number(Math.min(100, Math.max(0, drag.positionY - ((event.clientY - drag.y) / bounds.height) * 100)).toFixed(1)) }) }} onPointerUp={(event) => { dragRef.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }} onPointerCancel={() => { dragRef.current = null }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}<img src={image.src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: `${image.positionX}% ${image.positionY}%`, transform: `scale(${image.zoom})`, transformOrigin: `${image.positionX}% ${image.positionY}%` }} />
    {editing && onUpload && <label data-section-editor-control="true" className={`absolute right-3 top-3 z-30 cursor-pointer rounded-full border border-sand bg-silk/95 font-sans font-bold uppercase tracking-[0.1em] text-forest shadow-lg ${compact ? 'px-2.5 py-1.5 text-[8px]' : 'px-4 py-2 text-[10px]'}`}>{compact ? 'Ganti' : 'Ganti gambar'}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async (event) => { const file = event.target.files?.[0]; if (file) onChange({ ...image, src: await onUpload(file) }); event.currentTarget.value = '' }} /></label>}
    {editing && <span data-section-editor-control="true" className={`pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-brown/90 font-sans font-semibold text-white shadow-lg ${compact ? 'px-2 py-1 text-[8px]' : 'px-4 py-2 text-[10px]'}`}>{compact ? 'Seret · scroll zoom' : 'Seret gambar · scroll untuk zoom'}</span>}
  </div>
}

export default function ImpactAnimated({ section, editing = false, onContentChange, onImageUpload }: { section?: HomepageSection; editing?: boolean; onContentChange?: (value: string) => void; onImageUpload?: (file: File) => Promise<string> }) {
  const initial = readImpactContent(section)
  const [impactDescription, setImpactDescription] = useState(initial.description)
  const [images, setImages] = useState(initial.images)
  useEffect(() => { const next = readImpactContent(section); setImpactDescription(next.description); setImages(next.images) }, [section?.id, section?.description])
  const getImage = (key: string, src: string, x = 50, y = 50): ImpactImageState => images[key] ?? { src, positionX: x, positionY: y, zoom: 1 }
  const updateImage = (key: string, value: ImpactImageState) => { const next = { ...images, [key]: value }; setImages(next); onContentChange?.(`${impactContentMarker}${JSON.stringify({ description: impactDescription, images: next })}`) }
  return (
    <main className="overflow-hidden px-5 py-8 sm:px-6 md:py-12">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-7xl overflow-hidden rounded-[34px] border border-sand bg-forest text-silk shadow-[0_30px_90px_rgba(39,55,43,0.22)] lg:grid-cols-[0.92fr_1.08fr]"
      >
        <motion.div variants={itemVariants} className="relative min-h-[430px] p-7 sm:p-10 lg:min-h-[680px] lg:p-12">
          <div className="absolute inset-0">
            <ImpactEditableImage image={getImage('hero', section?.imageUrl ?? '/images/mbatik-bareng/mbatik-jalanan-04.webp', 50, 68)} alt="Kegiatan membatik bersama Setitik" editing={editing} onChange={(value) => updateImage('hero', value)} onUpload={onImageUpload} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest/55 via-forest/38 to-forest/90" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="inline-flex items-center gap-3 rounded-full border border-silk/25 bg-silk/10 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.25em] text-silk/70 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-brown" />
                Dampak Setitik
              </p>
              <h1 className="mt-8 max-w-xl font-serif text-5xl leading-[0.98] text-white sm:text-6xl lg:text-7xl">
                {section?.title ?? <><span>Budaya yang hidup,</span><span className="block italic text-brown">komunitas yang bergerak.</span></>}
              </h1>
            </div>

            <div className="mt-8 grid gap-3 border-t border-silk/18 pt-6 sm:grid-cols-3">
              {impactFlow.map((item) => (
                <div key={item.title} className="rounded-2xl bg-silk/10 p-4 backdrop-blur-md">
                  <p className="font-serif text-xl text-white">{item.title}</p>
                  <p className="mt-2 font-sans text-[11px] leading-relaxed text-silk/58">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="relative bg-cream p-5 text-ink sm:p-8 lg:p-10">
          <motion.div variants={itemVariants} className="grid gap-6 border-b border-sand pb-7 md:grid-cols-[0.82fr_1fr] md:items-end">
            <div className="max-w-sm">
              <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-brown">Program utama</p>
              <h2 className="mt-4 font-serif text-[38px] leading-[0.98] md:text-5xl">Dampak yang dikerjakan.</h2>
            </div>
            <p className="border-l border-brown/35 pl-5 font-sans text-sm leading-[1.8] text-stone">
              {impactDescription}
            </p>
          </motion.div>

          <motion.div variants={containerVariants} className="mt-7 grid gap-5">
            {impactStories.map((story, index) => (
              <motion.article
                key={story.title}
                variants={itemVariants}
                className="group grid overflow-hidden rounded-[24px] border border-sand bg-paper shadow-[0_18px_45px_rgba(60,45,28,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_58px_rgba(60,45,28,0.11)] sm:grid-cols-[0.64fr_1fr]"
              >
                {story.image && (
                  <div className="relative min-h-[230px] sm:min-h-[260px]">
                    <ImpactEditableImage image={getImage(`story-${index}`, story.image, 50, Number.parseFloat(story.position.split(' ')[1]) || 50)} alt={story.title} editing={editing} compact onChange={(value) => updateImage(`story-${index}`, value)} onUpload={onImageUpload} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/55 via-forest/5 to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-paper/92 px-3.5 py-2 font-sans text-[8px] uppercase tracking-[0.18em] text-stone shadow-sm backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-brown" />
                      {story.label}
                    </span>
                    <span className="absolute bottom-4 right-4 font-serif text-5xl leading-none text-white/92 drop-shadow">
                      {story.number}
                    </span>
                  </div>
                )}

                <div className="flex min-h-[230px] flex-col justify-center p-6 sm:min-h-[260px] sm:p-7">
                  <div className="max-w-md">
                    <p className="font-sans text-[8px] uppercase tracking-[0.22em] text-brown">
                      Program {story.number}
                    </p>
                    <h3 className="mt-3 font-serif text-[30px] leading-[1.04] text-ink md:text-4xl">{story.title}</h3>
                    <div className="mt-5 h-px w-full bg-sand" />
                    <p className="mt-5 font-sans text-sm leading-[1.78] text-stone">{story.body}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
