'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import type { HomepageSection } from '@/lib/homepage-sections'
import { collectEditableTextElements } from '@/lib/section-text-overrides'
export default function SectionTextOverrides({ section, children }: { section: HomepageSection; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (section.sectionKey === 'collaboration-events') return
    collectEditableTextElements(root).forEach((element, index) => {
      const value = section.textOverrides?.[`text-${index}`]
      if (value !== undefined) element.innerText = value
    })
  }, [children, section.textOverrides])
  return <div ref={rootRef}>{children}</div>
}
