'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const LINKS = [
  { href: '#modelos', label: 'Los Modelos' },
  { href: '#proceso', label: 'El Proceso' },
  { href: '#edicion-limitada', label: 'Edición Limitada' },
  { href: '#contacto', label: 'Contacto' },
]

export function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const drawerLinksRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const drawerTl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    if (!navRef.current) return
    const isMobile = window.matchMedia('(max-width: 767px)').matches

    // En mobile el nav (con la hamburguesa) está visible desde el inicio
    // para poder abrir el menú sin tener que scrollear primero.
    if (isMobile) {
      gsap.set(navRef.current, { opacity: 1, y: 0, pointerEvents: 'auto' })
      return
    }

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

  // ─── Drawer mobile — timeline GSAP construido una sola vez ───────────
  useGSAP(
    () => {
      const drawer = drawerRef.current
      const backdrop = backdropRef.current
      const links = drawerLinksRef.current?.querySelectorAll<HTMLElement>('[data-drawer-link]') ?? []
      if (!drawer || !backdrop) return

      gsap.set(backdrop, { autoAlpha: 0 })
      gsap.set(drawer, { xPercent: 100 })
      gsap.set(links, { opacity: 0, x: 24 })

      const tl = gsap.timeline({ paused: true })
      tl.to(backdrop, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0)
        .to(drawer, { xPercent: 0, duration: 0.55, ease: 'expo.out' }, 0)
        .to(
          links,
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
          0.2,
        )

      drawerTl.current = tl
    },
    { dependencies: [] },
  )

  useEffect(() => {
    const tl = drawerTl.current
    if (!tl) return
    if (open) tl.play()
    else tl.reverse()
  }, [open])

  // Bloquear scroll del body cuando el drawer está abierto.
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  // Cerrar con tecla Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full flex items-center justify-between px-[6vw] py-3 md:py-5"
        style={{
          zIndex: 100,
          backgroundColor: 'rgba(8, 9, 11, 0.72)',
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
          borderBottom: '1px solid rgba(0, 255, 136, 0.08)',
          pointerEvents: 'auto',
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
          {LINKS.slice(0, 3).map(({ href, label }) => (
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
          className="hidden md:inline-flex btn-obsidian btn-secondary"
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            padding: '10px 22px',
          }}
        >
          Contacto
        </Link>

        {/* Botón hamburguesa — solo mobile */}
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((v) => !v)}
          data-cursor="button"
          className="md:hidden relative inline-flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            border: '1px solid rgba(0, 255, 136, 0.35)',
            borderRadius: 2,
            backgroundColor: 'rgba(0, 255, 136, 0.04)',
            zIndex: 201,
            pointerEvents: 'auto',
          }}
        >
          <span className="sr-only">Abrir menú</span>
          <span
            aria-hidden
            className="flex flex-col items-center justify-center gap-[5px]"
            style={{ width: 18 }}
          >
            <span
              style={{
                display: 'block',
                width: 18,
                height: 1.5,
                backgroundColor: '#00FF88',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 12,
                height: 1.5,
                backgroundColor: '#00FF88',
                alignSelf: 'flex-end',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 18,
                height: 1.5,
                backgroundColor: '#00FF88',
              }}
            />
          </span>
        </button>
      </nav>

      {/* Backdrop — fuera del nav para cubrir todo el viewport */}
      <div
        ref={backdropRef}
        onClick={() => setOpen(false)}
        aria-hidden
        className="fixed inset-0 md:hidden"
        style={{
          zIndex: 199,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          visibility: 'hidden',
          opacity: 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Drawer — entra por la derecha, 80% del ancho, 100vh, z-index máximo */}
      <aside
        ref={drawerRef}
        id="mobile-drawer"
        aria-hidden={!open}
        aria-label="Menú móvil"
        className="fixed top-0 right-0 md:hidden flex flex-col"
        style={{
          zIndex: 200,
          width: '80vw',
          maxWidth: 420,
          height: '100vh',
          backgroundColor: 'rgba(6, 8, 9, 0.96)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          borderLeft: '1px solid rgba(0, 255, 136, 0.18)',
          boxShadow: '-24px 0 80px -20px rgba(0, 0, 0, 0.7)',
          transform: 'translateX(100%)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Header del drawer — logo + botón X */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(0, 255, 136, 0.08)',
          }}
        >
          <span
            className="font-serif flex items-center gap-2"
            style={{ color: '#00FF88', fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}
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
          </span>

          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            data-cursor="button"
            className="relative inline-flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 2,
              backgroundColor: 'transparent',
              transition: 'border-color 200ms ease, background-color 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.7)'
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.3)'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="#00FF88"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Lista de links */}
        <ul
          ref={drawerLinksRef}
          className="flex flex-col"
          style={{ padding: '32px 24px 24px', gap: 4 }}
        >
          {LINKS.map(({ href, label }, i) => (
            <li key={href} data-drawer-link>
              <Link
                href={href}
                onClick={(e) => {
                  // Cierra el drawer con animación y luego navega al hash —
                  // así evitamos race conditions con el body lock.
                  e.preventDefault()
                  setOpen(false)
                  window.setTimeout(() => {
                    const el = document.querySelector(href)
                    if (el && 'scrollIntoView' in el) {
                      ;(el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' })
                    } else {
                      window.location.hash = href
                    }
                  }, 480)
                }}
                data-cursor="button"
                className="font-serif flex items-baseline gap-4 transition-colors"
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#F0F7F0',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(240, 247, 240, 0.08)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#00FF88')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#F0F7F0')}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.3em',
                    color: '#00FF88',
                    minWidth: 28,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer del drawer — meta info */}
        <div
          className="mt-auto font-mono"
          style={{
            padding: '24px',
            borderTop: '1px solid rgba(0, 255, 136, 0.08)',
            fontSize: 10,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(240, 247, 240, 0.45)',
            lineHeight: 1.8,
          }}
        >
          <div>34°36′ S · 58°22′ W</div>
          <div style={{ color: 'rgba(0, 255, 136, 0.7)' }}>Buenos Aires — AR</div>
          <div style={{ marginTop: 12 }}>Obsidian · MMXXVI</div>
        </div>
      </aside>
    </>
  )
}
