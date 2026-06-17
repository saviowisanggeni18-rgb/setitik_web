import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/*
  Dua konteks penggunaan:
  1. Label kategori produk  → variant: 'tulis' | 'cap' | 'lain'
  2. Status jadwal event    → variant: 'open' | 'full' | 'soon'
*/

type BadgeVariant = 'tulis' | 'cap' | 'lain' | 'open' | 'full' | 'soon' | 'default'

const variantClasses: Record<BadgeVariant, string> = {
  tulis:   'border-brown/25 text-brown   bg-brown/8',
  cap:     'border-forest/25 text-forest bg-forest/8',
  lain:    'border-stone/25 text-stone   bg-stone/8',
  open:    'border-forest/25 text-forest bg-forest/8',
  full:    'border-stone/25 text-stone   bg-stone/8',
  soon:    'border-brown/25 text-brown   bg-brown/8',
  default: 'border-sand text-stone       bg-sand/50',
}

const labelMap: Record<BadgeVariant, string | null> = {
  tulis:   'Batik Tulis',
  cap:     'Batik Cap',
  lain:    'Produk Lain',
  open:    'Buka',
  full:    'Penuh',
  soon:    'Segera',
  default: null,
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /*
    Jika children tidak diberikan, Badge menampilkan label bawaan sesuai variant.
    Jika children ada, children yang ditampilkan.
  */
}

export default function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const content = children ?? labelMap[variant]

  return (
    <span
      className={cn(
        'inline-block font-sans text-[10px] uppercase tracking-[0.15em]',
        'border px-2.5 py-1 rounded-sm',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {content}
    </span>
  )
}
