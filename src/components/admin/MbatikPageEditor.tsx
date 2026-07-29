'use client'

import { ChangeEvent, PointerEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Pencil, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react'
import type { MbatikGalleryItem, MbatikImage, MbatikPageContent } from '@/lib/mbatik-page-content'

type Props = { password: string }

export default function MbatikPageEditor({ password }: Props) {
  const [content, setContent] = useState<MbatikPageContent | null>(null)
  const [busy, setBusy] = useState(true)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState(false)

  const load = useCallback(async () => {
    setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/mbatik-page-content', { headers: { 'x-admin-password': password } })
      const body = await response.json()
      if (!response.ok) throw new Error(body.message)
      setContent(body.content)
      setEditing(false)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal memuat konten.') }
    finally { setBusy(false) }
  }, [password])

  useEffect(() => { void load() }, [load])

  async function save() {
    if (!content) return
    setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/mbatik-page-content', {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ content }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.message)
      setContent(body.content); setMessage('Konten Mbatik Bareng berhasil disimpan.'); setEditing(false)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal menyimpan.') }
    finally { setBusy(false) }
  }

  function patch<K extends keyof MbatikPageContent>(key: K, value: MbatikPageContent[K]) {
    setContent((current) => current ? { ...current, [key]: value } : current)
  }
  function patchItem(index: number, next: Partial<MbatikGalleryItem>) {
    if (!content) return
    patch('galleryItems', content.galleryItems.map((item, i) => i === index ? { ...item, ...next } : item))
  }
  function move(index: number, direction: -1 | 1) {
    if (!content) return
    const next = [...content.galleryItems]; const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]; patch('galleryItems', next)
  }
  function add() {
    if (!content) return
    patch('galleryItems', [...content.galleryItems, {
      id: crypto.randomUUID(), eyebrow: `Dokumentasi ${String(content.galleryItems.length + 1).padStart(2, '0')}`,
      title: 'Cerita Mbatik berikutnya', description: 'Klik teks ini untuk menulis cerita kegiatan.',
      image: { src: '/images/mbatik-bareng/mbatik-jalanan-02.webp', positionX: 50, positionY: 50, zoom: 1 },
    }])
  }

  if (!content) return <div className="border border-sand bg-silk p-8 text-sm text-stone">{busy ? 'Memuat editor visual...' : message}</div>

  return (
    <section className="mb-8 border border-sand bg-silk p-4 shadow-[0_18px_55px_rgba(65,49,31,0.08)] sm:p-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-sand pb-5">
        <div><p className="font-serif text-3xl">Tampilan halaman Mbatik Bareng</p><p className="mt-1 text-sm text-stone">{editing ? 'Mode edit aktif. Klik teks, seret foto, atau scroll pada foto untuk zoom.' : 'Mode pratinjau aktif. Tekan Edit teks/foto untuk mulai mengubah konten.'}</p></div>
        <div className="flex gap-2">
          <button onClick={() => void load()} disabled={busy} className="inline-flex items-center gap-2 border border-sand px-4 py-3 text-xs font-semibold"><RotateCcw size={15}/>Muat ulang</button>
          {editing ? <>
            <button onClick={() => void load()} disabled={busy} className="inline-flex items-center gap-2 border border-forest px-4 py-3 text-xs font-semibold text-forest"><X size={15}/>Batal</button>
            <button onClick={() => void save()} disabled={busy} className="inline-flex items-center gap-2 bg-forest px-5 py-3 text-xs font-semibold text-silk">{busy ? <Loader2 className="animate-spin" size={15}/> : <Save size={15}/>}Simpan semua</button>
          </> : <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 bg-forest px-5 py-3 text-xs font-semibold text-silk"><Pencil size={15}/>Edit teks/foto</button>}
        </div>
      </header>
      {message && <p className={`mb-5 border px-4 py-3 text-sm ${message.includes('berhasil') ? 'border-forest/30 bg-forest/5 text-forest' : 'border-red-200 bg-red-50 text-red-700'}`}>{message}</p>}

      <div className="relative min-h-[430px] overflow-hidden rounded-[28px] bg-forest text-silk">
        <EditableImage image={content.heroImage} onChange={(value) => patch('heroImage', value)} password={password} enabled={editing}/>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent"/>
        <div className="relative z-10 flex min-h-[430px] max-w-[610px] flex-col justify-center p-8">
          <Text enabled={editing} value={content.heroEyebrow} onChange={(v) => patch('heroEyebrow', v)} className="text-[10px] uppercase tracking-[.25em] text-silk/60"/>
          <Text enabled={editing} value={content.heroTitle} onChange={(v) => patch('heroTitle', v)} className="mt-5 font-serif text-5xl leading-none"/>
          <Text enabled={editing} value={content.heroAccent} onChange={(v) => patch('heroAccent', v)} className="font-serif text-5xl italic leading-none text-brown"/>
          <Text enabled={editing} value={content.heroDescription} onChange={(v) => patch('heroDescription', v)} className="mt-5 max-w-lg text-sm leading-7 text-silk/70"/>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-sand bg-forest p-5 text-silk">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.2em] text-silk/60">Latar bagian pendaftaran</p>
        <div className="relative h-52 overflow-hidden rounded-[18px]"><EditableImage image={content.registrationImage} onChange={(value) => patch('registrationImage', value)} password={password} enabled={editing}/></div>
      </div>

      <div className="mt-7 grid gap-5 border-y border-sand py-6 lg:grid-cols-2">
        <div><Text enabled={editing} value={content.galleryEyebrow} onChange={(v) => patch('galleryEyebrow', v)} className="text-[10px] uppercase tracking-[.22em] text-brown"/><Text enabled={editing} value={content.galleryTitle} onChange={(v) => patch('galleryTitle', v)} className="mt-2 font-serif text-4xl"/></div>
        <Text enabled={editing} value={content.galleryDescription} onChange={(v) => patch('galleryDescription', v)} className="border-l border-brown/30 pl-5 text-sm leading-7 text-stone"/>
      </div>

      <div className="mt-5 space-y-5">
        {content.galleryItems.map((item, index) => (
          <article key={item.id} className={`grid overflow-hidden rounded-[24px] border border-sand bg-cream lg:grid-cols-[1.12fr_.88fr] ${index % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
            <div className="relative min-h-[300px] overflow-hidden bg-sand"><EditableImage image={item.image} onChange={(image) => patchItem(index, { image })} password={password} enabled={editing}/></div>
            <div className="flex min-h-[300px] flex-col justify-between p-6">
              <div><Text enabled={editing} value={item.eyebrow} onChange={(v) => patchItem(index, { eyebrow: v })} className="text-[9px] uppercase tracking-[.22em] text-brown"/><Text enabled={editing} value={item.title} onChange={(v) => patchItem(index, { title: v })} className="mt-5 font-serif text-4xl leading-tight"/></div>
              <Text enabled={editing} value={item.description} onChange={(v) => patchItem(index, { description: v })} className="mt-8 border-t border-brown/25 pt-4 text-sm leading-7 text-stone"/>
              {editing && <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => move(index,-1)} disabled={index===0} className="rounded-full border border-sand p-2 disabled:opacity-30" aria-label="Naik"><ArrowUp size={15}/></button>
                <button onClick={() => move(index,1)} disabled={index===content.galleryItems.length-1} className="rounded-full border border-sand p-2 disabled:opacity-30" aria-label="Turun"><ArrowDown size={15}/></button>
                <button onClick={() => patch('galleryItems', content.galleryItems.filter((_,i)=>i!==index))} className="rounded-full border border-red-200 p-2 text-red-600" aria-label="Hapus"><Trash2 size={15}/></button>
              </div>}
            </div>
          </article>
        ))}
      </div>
      {editing && <button onClick={add} className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-dashed border-brown py-4 text-xs font-semibold uppercase tracking-[.18em] text-forest"><Plus size={16}/>Tambah dokumentasi</button>}
    </section>
  )
}

function Text({ value, onChange, className, enabled }: { value: string; onChange: (value: string) => void; className: string; enabled: boolean }) {
  return <div contentEditable={enabled} suppressContentEditableWarning className={`${className} min-h-[1.4em] outline-none ${enabled ? 'cursor-text ring-1 ring-brown/45 focus:ring-2' : ''}`} onBlur={(event) => enabled && onChange(event.currentTarget.textContent?.trim() || '')}>{value}</div>
}

function EditableImage({ image, onChange, password, enabled }: { image: MbatikImage; onChange: (value: MbatikImage) => void; password: string; enabled: boolean }) {
  const start = useRef<{ x:number; y:number; px:number; py:number } | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef(image)
  const onChangeRef = useRef(onChange)

  useEffect(() => { imageRef.current = image }, [image])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const handleWheel = (event: WheelEvent) => {
      if (!enabled) return
      event.preventDefault()
      event.stopPropagation()
      const current = imageRef.current
      onChangeRef.current({
        ...current,
        zoom: Math.max(1, Math.min(3, current.zoom + (event.deltaY < 0 ? 0.1 : -0.1))),
      })
    }

    frame.addEventListener('wheel', handleWheel, { passive: false })
    return () => frame.removeEventListener('wheel', handleWheel)
  }, [enabled])

  function down(event: PointerEvent<HTMLDivElement>) { if(!enabled)return; event.currentTarget.setPointerCapture(event.pointerId); start.current={x:event.clientX,y:event.clientY,px:image.positionX,py:image.positionY} }
  function move(event: PointerEvent<HTMLDivElement>) { if(!start.current)return; const rect=event.currentTarget.getBoundingClientRect(); onChange({...image,positionX:Math.max(0,Math.min(100,start.current.px-(event.clientX-start.current.x)/rect.width*100)),positionY:Math.max(0,Math.min(100,start.current.py-(event.clientY-start.current.y)/rect.height*100))}) }
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file=event.target.files?.[0]; if(!file)return
    const data=new FormData(); data.set('password',password); data.set('image',file)
    const response=await fetch('/api/site-images',{method:'POST',body:data}); const body=await response.json()
    if(response.ok) onChange({...image,src:body.imageUrl,positionX:50,positionY:50,zoom:1}); else window.alert(body.message || 'Gagal mengunggah gambar.')
    event.target.value=''
  }
  return <div ref={frameRef} className={`absolute inset-0 overflow-hidden overscroll-contain ${enabled ? 'touch-none cursor-grab active:cursor-grabbing' : ''}`} onPointerDown={down} onPointerMove={move} onPointerUp={()=>{start.current=null}}>
    {/* eslint-disable-next-line @next/next/no-img-element */}<img src={image.src} alt="" draggable={false} className="pointer-events-none h-full w-full select-none object-cover" style={{objectPosition:`${image.positionX}% ${image.positionY}%`,transform:`scale(${image.zoom})`}}/>
    {enabled && <><span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-brown px-3 py-2 text-[9px] font-semibold text-white shadow">Seret · scroll untuk zoom</span>
    <label className="absolute right-3 top-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-silk px-4 py-2 text-[10px] font-semibold text-forest shadow"><ImagePlus size={14}/>Ganti gambar<input type="file" accept="image/*" className="hidden" onChange={upload}/></label></>}
  </div>
}
