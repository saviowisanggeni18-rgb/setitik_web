import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brown text-silk border border-brown hover:bg-forest hover:border-forest',
  ghost:
    'bg-transparent text-ink border border-sand hover:border-brown hover:text-brown',
  link:
    'bg-transparent text-brown underline-offset-4 hover:underline hover:text-ink border-none shadow-none',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-8 py-3 text-sm',
  lg: 'px-10 py-4 text-base',
}

/*
  buttonVariants — utulitas untuk menerapkan style Button pada elemen selain <button>
  (misalnya <Link href="..."> yang perlu tampil sebagai tombol).

  Contoh penggunaan dengan Next.js Link:
    <Link href="/catalog" className={buttonVariants({ variant: 'primary' })}>
      Jelajahi Koleksi
    </Link>
*/
export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: Variant
  size?: Size
  className?: string
} = {}): string {
  return cn(
    'inline-flex items-center justify-center',
    'font-sans tracking-wide rounded-sm',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown/40',
    'disabled:opacity-50 disabled:pointer-events-none',
    variant === 'link' ? '' : sizeClasses[size],
    variantClasses[variant],
    className
  )
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  )
}
