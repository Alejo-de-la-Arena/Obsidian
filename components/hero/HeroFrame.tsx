'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

/**
 * HeroFrame — capa decorativa tipo HUD editorial.
 *
 *   • Esquinas (4 ticks)            — anclas visuales.
 *   • Label vertical izquierdo      — "OBSIDIAN / MMXXV".
 *   • Coordenadas esquina sup. der. — "34° 36' S · 58° 22' W" (Buenos Aires).
 *   • Status pill inferior izq.     — "LIVE · 12 unidades restantes".
 *
 * Todos los elementos son puramente decorativos (aria-hidden) y animan en
 * la timeline de entrada con stagger.
 */

export function HeroFrame() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!rootRef.current) return

      const ticks = rootRef.current.querySelectorAll('[data-frame-tick]')
      gsap.fromTo(
        ticks,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          stagger: noMotion ? 0 : 0.08,
          delay: noMotion ? 0 : 0.2,
          duration: noMotion ? 0.01 : 0.7,
          ease: 'expo.out',
        },
      )

      const info = rootRef.current.querySelectorAll('[data-frame-info]')
      gsap.fromTo(
        info,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: noMotion ? 0 : 0.1,
          delay: noMotion ? 0 : 0.7,
          duration: noMotion ? 0.01 : 0.6,
          ease: 'power3.out',
        },
      )
    },
    { scope: rootRef },
  )

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 4 }}
    >
      {/* Esquinas — solo desktop */}
      <div className="hidden md:block">
        <Corner position="tl" />
        <Corner position="tr" />
        <Corner position="bl" />
        <Corner position="br" />
      </div>

      {/* Label vertical izquierdo — solo desktop */}
      <div
        data-frame-info
        className="absolute font-mono hidden lg:block"
        style={{
          top: '50%',
          left: 24,
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          fontSize: 10,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: 'rgba(240, 247, 240, 0.35)',
          opacity: 0,
        }}
      >
        Obsidian · MMXXVI
      </div>

      {/* Coordenadas esquina superior derecha — solo desktop */}
      <div
        data-frame-info
        className="absolute font-mono text-right hidden lg:block"
        style={{
          top: 32,
          right: 'clamp(24px, 4vw, 64px)',
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(240, 247, 240, 0.45)',
          opacity: 0,
          lineHeight: 1.6,
        }}
      >
        <div>34°36′ S · 58°22′ W</div>
        <div className="text-seiko/70">Buenos Aires — AR</div>
      </div>
    </div>
  )
}

type CornerPos = 'tl' | 'tr' | 'bl' | 'br'

function Corner({ position }: { position: CornerPos }) {
  const size = 18
  const stroke = 1
  const color = 'rgba(240, 247, 240, 0.25)'

  const base: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
  }

  const horiz: React.CSSProperties = {
    position: 'absolute',
    height: stroke,
    width: size,
    backgroundColor: color,
  }
  const vert: React.CSSProperties = {
    position: 'absolute',
    width: stroke,
    height: size,
    backgroundColor: color,
  }

  const margin = 24

  const positions: Record<CornerPos, React.CSSProperties> = {
    tl: { top: margin, left: margin },
    tr: { top: margin, right: margin },
    bl: { bottom: margin, left: margin },
    br: { bottom: margin, right: margin },
  }

  const isTop = position.startsWith('t')
  const isLeft = position.endsWith('l')

  return (
    <div data-frame-tick style={{ ...base, ...positions[position], opacity: 0 }}>
      <span
        style={{
          ...horiz,
          top: isTop ? 0 : 'auto',
          bottom: isTop ? 'auto' : 0,
          left: isLeft ? 0 : 'auto',
          right: isLeft ? 'auto' : 0,
        }}
      />
      <span
        style={{
          ...vert,
          top: isTop ? 0 : 'auto',
          bottom: isTop ? 'auto' : 0,
          left: isLeft ? 0 : 'auto',
          right: isLeft ? 'auto' : 0,
        }}
      />
    </div>
  )
}
