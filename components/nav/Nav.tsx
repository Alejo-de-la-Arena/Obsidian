'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const LINKS = [
  { href: '#modelos', label: 'Los Modelos' },
  { href: '#proceso', label: 'El Proceso' },
  { href: '#edicion-limitada', label: 'Edición Limitada' },
]

export function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!navRef.current) return
    gsap.set(navRef.current, { opacity: 0, y: -12, pointerEvents: 'none' })

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top -80px',
      onEnter: () => {
        gsap.to(navRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          pointerEvents: 'auto',
        })
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, {
          opacity: 0,
          y: -12,
          duration: 0.4,
          ease: 'power2.in',
          pointerEvents: 'none',
        })
      },
    })
  })

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full flex items-center justify-between px-[6vw] py-5"
      style={{
        zIndex: 100,
        backgroundColor: 'rgba(8, 9, 11, 0.72)',
        backdropFilter: 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        borderBottom: '1px solid rgba(0, 255, 136, 0.08)',
      }}
      aria-label="Navegación principal"
    >
      <Link
        href="#hero"
        data-cursor="button"
        className="font-serif flex items-center gap-2"
        style={{ color: '#00FF88', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}
      >
        <span
          aria-hidden
          className="inline-block rounded-full animate-pulse-seiko"
          style={{
            width: 7,
            height: 7,
            backgroundColor: '#00FF88',
            boxShadow: '0 0 10px rgba(0, 255, 136, 0.7)',
          }}
        />
        <span style={{ fontStyle: 'italic' }}>Obsidian</span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            data-cursor="button"
            className="font-mono nav-link"
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(240, 247, 240,0.65)',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <Link
        href="#contacto"
        data-cursor="button"
        className="btn-obsidian btn-secondary"
        style={{
          fontSize: 10,
          letterSpacing: '0.22em',
          padding: '10px 22px',
        }}
      >
        Contacto
      </Link>
    </nav>
  )
}
