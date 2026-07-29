'use client'
import { useEffect, useRef, useState } from 'react'
import type { HomepageSection } from '@/lib/homepage-sections'

type CustomImageSlot = { src: string; positionX: number; positionY: number; zoom: number }
const customContentMarker = '__SETITIK_CUSTOM_CONTENT__:'

function readCustomContent(section: HomepageSection) {
  if (section.description.startsWith(customContentMarker)) {
    try {
      const parsed = JSON.parse(section.description.slice(customContentMarker.length)) as { description?: string; images?: Record<string, CustomImageSlot> }
      return { description: parsed.description ?? '', images: parsed.images ?? {} }
    } catch {}
  }
  return { description: section.description, images: {} as Record<string, CustomImageSlot> }
}

function CustomEditableImage({ image, alt, editing, compact, onChange, onUpload }: { image: CustomImageSlot; alt: string; editing: boolean; compact?: boolean; onChange: (value: CustomImageSlot) => void; onUpload?: (file: File) => Promise<string> }) {
  const dragRef = useRef<{ x: number; y: number; positionX: number; positionY: number } | null>(null)
  return <div className={`absolute inset-0 overflow-hidden ${editing ? 'cursor-grab touch-none overscroll-contain active:cursor-grabbing' : ''}`} onWheel={(event) => { if (!editing) return; event.preventDefault(); event.stopPropagation(); const zoom = Math.min(3, Math.max(1, image.zoom + (event.deltaY < 0 ? 0.1 : -0.1))); onChange({ ...image, zoom: Number(zoom.toFixed(2)) }) }} onPointerDown={(event) => { if (!editing || (event.target as Element).closest('label,input')) return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { x: event.clientX, y: event.clientY, positionX: image.positionX, positionY: image.positionY } }} onPointerMove={(event) => { const drag = dragRef.current; if (!drag || !editing) return; const bounds = event.currentTarget.getBoundingClientRect(); onChange({ ...image, positionX: Number(Math.min(100, Math.max(0, drag.positionX - ((event.clientX - drag.x) / bounds.width) * 100)).toFixed(1)), positionY: Number(Math.min(100, Math.max(0, drag.positionY - ((event.clientY - drag.y) / bounds.height) * 100)).toFixed(1)) }) }} onPointerUp={(event) => { dragRef.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }} onPointerCancel={() => { dragRef.current = null }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}<img src={image.src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: `${image.positionX}% ${image.positionY}%`, transform: `scale(${image.zoom})`, transformOrigin: `${image.positionX}% ${image.positionY}%` }} />
    {editing && onUpload && <label data-section-editor-control="true" className={`absolute right-3 top-3 z-30 cursor-pointer rounded-full border border-sand bg-silk/95 font-sans font-bold uppercase text-forest shadow-lg ${compact ? 'px-2 py-1.5 text-[8px]' : 'px-4 py-2 text-[10px]'}`}>{compact ? 'Ganti' : 'Ganti gambar'}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async (event) => { const file = event.target.files?.[0]; if (file) onChange({ ...image, src: await onUpload(file) }); event.currentTarget.value = '' }} /></label>}
    {editing && <span data-section-editor-control="true" className={`pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-brown/90 font-sans font-semibold text-white ${compact ? 'px-2 py-1 text-[8px]' : 'px-3 py-1.5 text-[10px]'}`}>{compact ? 'Seret · scroll' : 'Seret gambar · scroll zoom'}</span>}
  </div>
}

export default function CustomHomepageSection({
  section,
  index = 0,
  editing = false,
  onContentChange,
  onImageUpload,
}: {
  section: HomepageSection
  index?: number
  editing?: boolean
  onContentChange?: (value: string) => void
  onImageUpload?: (file: File) => Promise<string>
}) {
  const initial = readCustomContent(section)
  const [contentDescription, setContentDescription] = useState(initial.description)
  const [imageSlots, setImageSlots] = useState(initial.images)
  useEffect(() => { const next = readCustomContent(section); setContentDescription(next.description); setImageSlots(next.images) }, [section.id, section.description])
  const fallbackImage = section.imageUrl ?? '/images/editorial/founder-canting.webp'
  const hasImage = Boolean(section.imageUrl || Object.values(imageSlots).some((slot) => Boolean(slot?.src)))
  const reverse = section.template === 'image-left' || index % 2 === 1
  const eyebrow =
    section.label.trim().toLowerCase() !== section.title.trim().toLowerCase()
      ? section.label
      : section.page === 'about'
        ? 'Cerita Setitik'
        : section.page === 'impact'
          ? 'Catatan Dampak'
          : 'Kabar Setitik'
  const imagePositionX = section.imagePositionX ?? 50
  const imagePositionY = section.imagePositionY ?? 50
  const imageZoom = Math.max(1, section.imageZoom ?? 1)
  const imageStyle = {
    objectPosition: `${imagePositionX}% ${imagePositionY}%`,
    transform: `scale(${imageZoom})`,
    transformOrigin: `${imagePositionX}% ${imagePositionY}%`,
  }
  const getSlot = (key: string): CustomImageSlot => imageSlots[key] ?? { src: fallbackImage, positionX: imagePositionX, positionY: imagePositionY, zoom: imageZoom }
  const updateSlot = (key: string, value: CustomImageSlot) => { const next = { ...imageSlots, [key]: value }; setImageSlots(next); onContentChange?.(`${customContentMarker}${JSON.stringify({ description: contentDescription, images: next })}`) }
  const impactSectionClass = section.page === 'impact' ? 'border-y border-sand bg-cream' : ''

  if (section.template === 'mosaic') {
    return (
      <section className={`bg-cream px-6 py-6 text-silk ${impactSectionClass}`}>
        <article className="mx-auto grid min-h-[520px] max-w-7xl gap-2 overflow-hidden rounded-[30px] bg-forest p-2 shadow-[0_24px_70px_rgba(30,45,34,0.18)] md:grid-cols-2 md:grid-rows-2 lg:aspect-[2.4/1] lg:min-h-0">
          <div className="relative min-h-72 overflow-hidden rounded-[25px] md:row-span-2 lg:min-h-0">
            {hasImage ? <CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} /> : <div className="absolute inset-0 bg-brown/45" />}
            <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative overflow-hidden rounded-[25px] bg-brown/50">{hasImage ? <CustomEditableImage image={getSlot('slot-1')} alt={`${section.title} pendamping`} editing={editing} compact onChange={(value) => updateSlot('slot-1', value)} onUpload={onImageUpload} /> : null}</div>
            <div className="relative overflow-hidden rounded-[25px] border border-silk/12 bg-silk/5">
              {hasImage ? <CustomEditableImage image={getSlot('slot-2')} alt={`${section.title} detail`} editing={editing} compact onChange={(value) => updateSlot('slot-2', value)} onUpload={onImageUpload} /> : null}
            </div>
          </div>
          <div className="flex flex-col justify-end rounded-[25px] bg-silk p-8 text-ink sm:p-10">
            <p data-homepage-eyebrow className="text-[10px] uppercase tracking-[0.24em] text-brown">{eyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{section.title}</h2>
            <p className="mt-5 text-sm leading-[1.8] text-stone">{contentDescription}</p>
          </div>
        </article>
      </section>
    )
  }

  if (section.template === 'quote') {
    return (
      <section className="bg-silk px-6 py-6">
        <article className="relative mx-auto grid min-h-[440px] max-w-7xl overflow-hidden rounded-[30px] bg-forest text-silk shadow-[0_24px_70px_rgba(30,45,34,0.18)] lg:aspect-[2.9/1] lg:min-h-0 lg:grid-cols-[1fr_0.55fr]">
          <div className="flex flex-col justify-center p-9 sm:p-12 lg:p-16">
            <span className="font-serif text-7xl leading-none text-brown">“</span>
            <h2 className="max-w-4xl font-serif text-4xl italic leading-[1.15] md:text-5xl">{section.title}</h2>
            <p className="mt-8 max-w-2xl border-t border-silk/15 pt-6 text-sm leading-[1.9] text-silk/60">{contentDescription}</p>
          </div>
          <div className="relative min-h-80 overflow-hidden bg-silk/5 lg:min-h-0">
            {hasImage ? <CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} /> : null}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/50 to-transparent" />
          </div>
        </article>
      </section>
    )
  }

  if (section.template === 'magazine') {
    return (
      <section className={`bg-cream px-6 py-6 text-ink ${impactSectionClass}`}>
        <article className="mx-auto grid min-h-[520px] max-w-7xl gap-3 overflow-hidden rounded-[30px] bg-silk p-3 shadow-[0_22px_65px_rgba(68,52,34,0.09)] lg:aspect-[2.4/1] lg:min-h-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative min-h-[400px] overflow-hidden rounded-[24px] bg-sand lg:min-h-0">
            {hasImage ? <CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent" />
            <h2 className="absolute bottom-8 left-8 right-8 max-w-3xl font-serif text-4xl leading-[1.04] text-silk md:text-6xl">{section.title}</h2>
          </div>
          <div className="grid gap-3 lg:grid-rows-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden rounded-[25px] bg-forest">{hasImage ? <CustomEditableImage image={getSlot('slot-1')} alt={`${section.title} pendamping`} editing={editing} compact onChange={(value) => updateSlot('slot-1', value)} onUpload={onImageUpload} /> : null}</div>
            <div className="flex flex-col justify-end rounded-[25px] bg-cream p-8">
              <p data-homepage-eyebrow className="text-[10px] uppercase tracking-[0.24em] text-brown">{eyebrow}</p>
              <p className="mt-6 text-sm leading-[1.9] text-stone">{contentDescription}</p>
            </div>
          </div>
        </article>
      </section>
    )
  }

  if (section.template === 'overlap') {
    return (
      <section className="overflow-hidden bg-silk px-6 py-10 text-silk">
        <article className="relative mx-auto min-h-[520px] max-w-7xl lg:aspect-[2.4/1] lg:min-h-0">
          <div className="absolute inset-y-0 left-0 w-[78%] overflow-hidden rounded-[32px] bg-sand">
            {hasImage ? <CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} /> : null}
          </div>
          <div className="absolute bottom-10 right-0 w-[62%] rounded-[30px] bg-forest p-9 shadow-[0_28px_80px_rgba(30,45,34,0.28)] sm:p-12 lg:p-14">
            <p data-homepage-eyebrow className="text-[10px] uppercase tracking-[0.24em] text-brown">{eyebrow}</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">{section.title}</h2>
            <p className="mt-6 max-w-xl text-sm leading-[1.9] text-silk/65">{contentDescription}</p>
          </div>
        </article>
      </section>
    )
  }

  if (section.template === 'banner') {
    return (
      <section className="bg-cream px-6 py-6 text-ink">
        <article className="relative mx-auto min-h-[500px] max-w-7xl overflow-hidden rounded-[30px] bg-sand shadow-[0_22px_65px_rgba(68,52,34,0.09)] lg:aspect-[2.5/1] lg:min-h-0">
          {hasImage ? <CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} /> : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 rounded-[26px] bg-silk/95 p-7 shadow-xl backdrop-blur sm:inset-x-8 sm:bottom-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div><p data-homepage-eyebrow className="text-[10px] uppercase tracking-[0.24em] text-brown">{eyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{section.title}</h2></div>
            <p className="mt-5 max-w-lg border-l border-brown/30 pl-5 text-sm leading-[1.9] text-stone lg:mt-0">{contentDescription}</p>
          </div>
        </article>
      </section>
    )
  }

  if (section.template === 'minimal') {
    return (
      <section className="bg-silk px-6 py-6 text-ink md:py-10">
        <article className="mx-auto max-w-6xl border-y border-sand py-8 text-center md:py-10">
          <p data-homepage-eyebrow className="text-[10px] uppercase tracking-[0.28em] text-brown">{eyebrow}</p>
          <h2 className="mx-auto mt-5 max-w-5xl font-serif text-4xl leading-[1.06] md:text-6xl">{section.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-[1.8] text-stone md:text-base">{contentDescription}</p>
          {hasImage ? <figure className="relative mx-auto mt-7 aspect-[16/6] max-w-4xl overflow-hidden rounded-[24px]"><CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} /></figure> : null}
        </article>
      </section>
    )
  }

  if (section.template === 'immersive') {
    return (
      <section className="bg-cream px-6 py-4 text-silk md:py-6">
        <article className="relative mx-auto min-h-[500px] max-w-7xl overflow-hidden rounded-[30px] bg-forest shadow-[0_24px_70px_rgba(30,45,34,0.18)] lg:aspect-[2.5/1] lg:min-h-0">
          {hasImage ? <CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} /> : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest via-forest/72 to-forest/10" />
          <div className="absolute inset-5 rounded-[25px] border border-white/15 sm:inset-7" />
          <div className="relative flex min-h-[500px] max-w-2xl flex-col justify-end p-9 sm:p-11 lg:min-h-0 lg:p-12">
            <p data-homepage-eyebrow className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.25em] text-silk/55">
              <span className="h-px w-9 bg-brown" /> {eyebrow}
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.02] text-silk md:text-6xl">{section.title}</h2>
            <p className="mt-7 max-w-xl whitespace-pre-line font-sans text-sm leading-[1.9] text-silk/68 md:text-base">
              {contentDescription}
            </p>
          </div>
        </article>
      </section>
    )
  }

  if (section.template === 'statement') {
    return (
      <section className="bg-silk px-6 py-6 text-ink md:py-10">
        <article className="mx-auto grid max-w-7xl overflow-hidden rounded-[32px] border border-sand bg-cream shadow-[0_24px_75px_rgba(68,52,34,0.09)] lg:aspect-[2.5/1] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-h-[430px] flex-col justify-between p-8 sm:p-10 lg:min-h-0 lg:p-12">
            <p data-homepage-eyebrow className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.25em] text-brown">
              <span className="h-px w-9 bg-brown" /> {eyebrow}
            </p>
            <h2 className="my-8 max-w-4xl font-serif text-4xl leading-[1.05] md:text-6xl">{section.title}</h2>
            <p className="max-w-2xl border-t border-sand pt-6 font-sans text-sm leading-[1.9] text-stone">
              {contentDescription}
            </p>
          </div>
          <div className="relative min-h-[380px] overflow-hidden bg-forest text-silk lg:min-h-0">
            {hasImage ? <CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} /> : null}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest via-forest/25 to-transparent" />
            <p className="absolute bottom-9 left-9 right-9 font-serif text-3xl italic leading-snug text-silk">
              Cerita yang tumbuh bersama Setitik.
            </p>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section className="bg-cream px-6 py-4 text-ink md:py-6">
      <article className="mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-sand bg-silk shadow-[0_24px_75px_rgba(68,52,34,0.09)]">
        <div className={`grid lg:aspect-[2.65/1] lg:min-h-0 lg:grid-cols-12 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <div className="relative flex flex-col justify-center px-7 py-8 sm:px-10 sm:py-10 lg:col-span-5 lg:px-12 lg:py-11">
            <div aria-hidden className="absolute left-0 top-12 hidden h-20 w-px bg-brown lg:block" />

            <p data-homepage-eyebrow className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.25em] text-brown">
              <span className="h-px w-9 bg-brown" />
              {eyebrow}
            </p>

            <h2 className="mt-8 max-w-xl font-serif text-4xl leading-[1.06] sm:text-5xl lg:text-[3.5rem]">
              {section.title}
            </h2>

            <div className="mt-7 h-px w-16 bg-sand" />
            <p className="mt-7 max-w-lg whitespace-pre-line font-sans text-sm leading-[1.9] text-stone md:text-[15px]">
              {contentDescription}
            </p>

            <div className="mt-7 flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.18em] text-stone/55">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-sand text-brown">
                {String(index + 1).padStart(2, '0')}
              </span>
              Setitik Cultureware
            </div>
          </div>

          <div className={`relative min-h-[360px] bg-sand lg:col-span-7 lg:min-h-0 ${reverse ? 'lg:border-r' : 'lg:border-l'} border-sand`}>
            {hasImage ? (
              <>
                <CustomEditableImage image={getSlot('slot-0')} alt={section.title} editing={editing} onChange={(value) => updateSlot('slot-0', value)} onUpload={onImageUpload} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-black/5" />
                <figcaption className="absolute bottom-6 left-6 rounded-full border border-white/25 bg-forest/35 px-4 py-2 font-sans text-[8px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md sm:bottom-8 sm:left-8">
                  Cerita visual · Setitik
                </figcaption>
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-forest p-10 text-center">
                <p className="max-w-md font-serif text-3xl italic leading-snug text-silk/85">
                  “{section.title}”
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}
