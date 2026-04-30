'use client'

import Link from 'next/link'
import { useRef, useEffect, ReactNode } from 'react'
import { gsap } from '@/lib/gsap'

interface MagneticButtonProps {
  href: string
  variant: 'primary' | 'secondary'
  children: ReactNode
  /** Fuerza del efecto magnético (0-1). */
  strength?: number
  /** Si true, ocupa el 100% del ancho en mobile (sm- breakpoint). */
  fullWidthMobile?: boolean
}

/**
 * Botón con efecto magnético — se acerca al cursor cuando está dentro del
 * área de influencia. Respeta prefers-reduced-motion y sólo se activa en
 * dispositivos con pointer fino.
 */
export function MagneticButton({
  href,
  variant,
  children,
  strength = 0.35,
  fullWidthMobile = false,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return

    const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hoverable || noMotion) return

    const xTo = gsap.quickTo(inner, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      xTo(relX * strength)
      yTo(relY * strength)
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return (
    <span
      ref={wrapRef}
      className={fullWidthMobile ? 'block w-full sm:inline-block sm:w-auto' : 'inline-block'}
      style={{ padding: 8, margin: -8 }}
    >
      <Link
        ref={innerRef}
        href={href}
        data-cursor="button"
        className={`btn-obsidian ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${
          fullWidthMobile ? 'magnetic-btn-full' : ''
        }`}
      >
        {children}
      </Link>
    </span>
  )
}
