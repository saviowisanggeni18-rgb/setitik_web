'use client'

import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

export default function SectionReveal({
  children,
  delay = 0,
  direction = 'up',
  showDivider = true,
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  showDivider?: boolean
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <>{children}</>
  }

  const offset = {
    up: { x: 0, y: 34 },
    left: { x: -22, y: 20 },
    right: { x: 22, y: 20 },
  }[direction]

  return (
    <div className="relative overflow-hidden">
      {showDivider ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 z-20 h-px w-[min(78rem,calc(100%-3rem))] -translate-x-1/2 bg-gradient-to-r from-transparent via-brown/65 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{
            duration: 0.52,
            ease,
            delay: Math.min(delay, 0.12),
          }}
        />
      ) : null}
      <motion.div
        initial={{ opacity: 0, ...offset, scale: 0.985 }}
        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{
          duration: 0.58,
          ease,
          delay: Math.min(delay, 0.12),
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
