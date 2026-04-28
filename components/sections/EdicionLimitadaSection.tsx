'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

type ModelAvailability = {
  key: 'NOIR' | 'ALBA' | 'FORGE'
  available: number
  total: number
}

const AVAILABILITY: ModelAvailability[] = [
  { key: 'NOIR', available: 8, total: 50 },
  { key: 'ALBA', available: 14, total: 50 },
  { key: 'FORGE', available: 5, total: 50 },
]

export function EdicionLimitadaSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const root = sectionRef.current
      if (!root) return

      // Texto izquierdo
      const leftItems = root.querySelectorAll<HTMLElement>('[data-edicion-left]')
      gsap.fromTo(
        leftItems,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: noMotion ? 0 : 0.1,
          duration: noMotion ? 0.01 : 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      )

      // Cards stagger
      const cards = root.querySelectorAll<HTMLElement>('[data-edicion-card]')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: noMotion ? 0 : 0.15,
          duration: noMotion ? 0.01 : 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        },
      )

      // Barras de progreso (% agotado)
      const fills = root.querySelectorAll<HTMLElement>('[data-progress-fill]')
      fills.forEach((el) => {
        const target = Number(el.dataset.progress ?? 0) / 100
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: target,
            duration: noMotion ? 0.01 : 1.4,
            ease: 'power2.out',
            transformOrigin: 'left',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          },
        )
      })

      // CountUp por número
      const counters = root.querySelectorAll<HTMLElement>('[data-count]')
      counters.forEach((el) => {
        const target = Number(el.dataset.count ?? 0)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: noMotion ? 0.01 : 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v))
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="edicion-limitada"
      className="relative w-full flex items-center"
      style={{
        minHeight: '80vh',
        backgroundColor: '#0D0D0D',
        borderTop: '1px solid rgba(0, 255, 136, 0.15)',
        paddingTop: 'clamp(80px, 12vh, 140px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)',
      }}
      aria-label="Edición Limitada OBSIDIAN"
    >
      <div
        className="mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
        style={{
          maxWidth: 1200,
          paddingLeft: 'clamp(24px, 6vw, 64px)',
          paddingRight: 'clamp(24px, 6vw, 64px)',
        }}
      >
        {/* Columna izquierda */}
        <div className="flex flex-col">
          <p
            data-edicion-left
            className="font-mono mb-6"
            style={{
              fontSize: 11,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#00FF88',
              opacity: 0,
            }}
          >
            Disponibilidad
          </p>

          <h2
            data-edicion-left
            className="font-serif text-bone mb-6"
            style={{
              fontSize: 'clamp(36px, 4vw, 56px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              fontWeight: 700,
              opacity: 0,
            }}
          >
            <span className="italic">Cincuenta.</span> Por modelo. Sin excepción.
          </h2>

          <p
            data-edicion-left
            className="font-sans text-bone mb-10"
            style={{
              fontSize: 'clamp(16px, 1.2vw, 18px)',
              lineHeight: 1.7,
              opacity: 0.65,
              fontWeight: 300,
              maxWidth: 460,
            }}
          >
            Cada reloj tarda tres meses en fabricarse. Eso limita la producción de manera natural.
            No podemos hacer más sin dejar de hacer lo que hacemos. Cincuenta unidades es el número
            que resulta de tomar ese tiempo en serio.
          </p>

          <div data-edicion-left style={{ opacity: 0 }}>
            <a
              href="#contacto"
              data-cursor="button"
              className="font-sans inline-flex items-center justify-center transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: '#00FF88',
                color: '#0A0A0A',
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00CC6A'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00FF88'
              }}
            >
              Reservar ahora
            </a>
          </div>
        </div>

        {/* Columna derecha — 3 contadores */}
        <div className="flex flex-col gap-5">
          {AVAILABILITY.map((m) => {
            const sold = m.total - m.available
            const pct = Math.round((sold / m.total) * 100)
            return (
              <div
                key={m.key}
                data-edicion-card
                className="flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(0, 255, 136, 0.12)',
                  borderRadius: 12,
                  padding: 28,
                  opacity: 0,
                }}
              >
                <div className="flex items-baseline justify-between mb-5">
                  <h3
                    className="font-serif italic"
                    style={{ color: '#F0F7F0', fontSize: 24, fontWeight: 400 }}
                  >
                    {m.key}
                  </h3>
                  <span
                    className="flex items-center gap-2 font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      color: 'rgba(240, 247, 240,0.5)',
                    }}
                  >
                    <span
                      className="relative inline-flex items-center justify-center"
                      style={{ width: 8, height: 8 }}
                    >
                      <span
                        className="absolute inset-0 rounded-full animate-pulse-seiko"
                        style={{ backgroundColor: '#00FF88', opacity: 0.4 }}
                      />
                      <span
                        className="relative rounded-full"
                        style={{ width: 4, height: 4, backgroundColor: '#00FF88' }}
                      />
                    </span>
                    En producción
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    data-count={m.available}
                    className="font-mono"
                    style={{
                      fontSize: 56,
                      color: '#00FF88',
                      fontWeight: 500,
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    0
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 14,
                      color: 'rgba(240, 247, 240,0.4)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    / {m.total} unidades
                  </span>
                </div>

                <p
                  className="font-sans mb-5"
                  style={{ fontSize: 12, color: 'rgba(240, 247, 240,0.5)' }}
                >
                  {m.available} unidades disponibles · {pct}% reservado
                </p>

                <div
                  className="relative w-full"
                  style={{
                    height: 2,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    data-progress-fill
                    data-progress={pct}
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: '100%',
                      backgroundColor: '#00FF88',
                      transformOrigin: 'left',
                      transform: 'scaleX(0)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
