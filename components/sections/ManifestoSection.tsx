'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const PARAGRAPHS = [
  'Cincuenta relojes por modelo. No es una estrategia de posicionamiento. Es el límite real de lo que podemos hacer con este nivel de atención. Más allá de ese número, algo se pierde.',
  'Tres meses por reloj. El metal se trabaja sin apuro. Las decisiones se toman una a la vez. El mecanismo se ajusta hasta que el sonido es el correcto, no el aceptable. No hay un departamento de calidad porque no hay manera de delegar eso.',
  'Un objeto fabricado resuelve. Un objeto hecho decide. Cada curva del case, cada plano del bisel, cada textura de la correa es una decisión tomada por una persona, no por un proceso.',
]

const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 50, label: 'unidades máximas por modelo' },
  { value: 3, label: 'meses de fabricación por pieza' },
  { value: 100, suffix: '%', label: 'ensamblado a mano' },
]

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const root = sectionRef.current
      if (!root) return

      // Columnas entran desde los lados.
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: noMotion ? 0.01 : 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      )
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: noMotion ? 0.01 : 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      )

      // Línea decorativa.
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: noMotion ? 0.01 : 0.8,
            ease: 'expo.out',
            transformOrigin: 'left',
            scrollTrigger: { trigger: lineRef.current, start: 'top 85%', once: true },
          },
        )
      }

      // Headline reveal por palabra.
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll<HTMLSpanElement>('[data-word]')
        gsap.fromTo(
          words,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: noMotion ? 0 : 0.05,
            duration: noMotion ? 0.01 : 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 80%', once: true },
          },
        )
      }

      // Stats — CountUp con stagger.
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll<HTMLElement>('[data-stat]')
        gsap.fromTo(
          items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            stagger: noMotion ? 0 : 0.2,
            duration: noMotion ? 0.01 : 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true },
          },
        )
        items.forEach((el, i) => {
          const numEl = el.querySelector<HTMLElement>('[data-stat-number]')
          if (!numEl) return
          const target = STATS[i].value
          const suffix = STATS[i].suffix ?? ''
          const obj = { v: 0 }
          gsap.to(obj, {
            v: target,
            duration: noMotion ? 0.01 : 1.6,
            ease: 'power2.out',
            delay: noMotion ? 0 : 0.2 * i,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              numEl.textContent = `${Math.round(obj.v)}${suffix}`
            },
          })
        })
      }

      // Párrafos del cuerpo.
      const blocks = rightRef.current?.querySelectorAll<HTMLParagraphElement>('[data-paragraph]')
      if (blocks) {
        gsap.fromTo(
          blocks,
          { opacity: 0, y: 20 },
          {
            opacity: 0.78,
            y: 0,
            stagger: noMotion ? 0 : 0.15,
            duration: noMotion ? 0.01 : 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: rightRef.current, start: 'top 70%', once: true },
          },
        )
      }

      // Cita destacada.
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, x: 16 },
          {
            opacity: 1,
            x: 0,
            duration: noMotion ? 0.01 : 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: quoteRef.current, start: 'top 85%', once: true },
          },
        )
      }
    },
    { scope: sectionRef },
  )

  const headlineWords = ['Hacemos', 'relojes', 'como', 'si', 'el', 'tiempo', 'importara.']

  return (
    <section
      ref={sectionRef}
      id="manifiesto"
      className="relative w-full"
      style={{
        backgroundColor: '#0A0A0A',
        paddingTop: 'clamp(80px, 14vh, 160px)',
        paddingBottom: 'clamp(80px, 14vh, 160px)',
      }}
      aria-label="Manifiesto OBSIDIAN"
    >
      <div
        className="mx-auto w-full grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-12 lg:gap-20 items-start"
        style={{
          maxWidth: 1200,
          paddingLeft: 'clamp(24px, 6vw, 64px)',
          paddingRight: 'clamp(24px, 6vw, 64px)',
        }}
      >
        {/* Columna izquierda */}
        <div ref={leftRef} className="flex flex-col" style={{ opacity: 0 }}>
          <p
            className="font-mono mb-6"
            style={{
              fontSize: 10,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#00FF88',
            }}
          >
            Manifiesto
          </p>

          <h2
            ref={titleRef}
            className="font-serif text-bone"
            style={{
              fontSize: 'clamp(32px, 3.5vw, 52px)',
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              paddingBottom: '0.1em',
            }}
          >
            {headlineWords.map((w, i) => (
              <span
                key={i}
                data-word
                className="inline-block"
                style={{
                  marginRight: i === headlineWords.length - 1 ? 0 : '0.25em',
                  willChange: 'transform, opacity',
                }}
              >
                {w}
              </span>
            ))}
          </h2>

          <span
            ref={lineRef}
            aria-hidden
            className="block"
            style={{
              width: 60,
              height: 1,
              backgroundColor: '#00FF88',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              margin: '32px 0',
            }}
          />

          <div
            ref={statsRef}
            className="grid grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-8"
          >
            {STATS.map((s, i) => (
              <div key={i} data-stat className="flex flex-col gap-1.5" style={{ opacity: 0 }}>
                <span
                  data-stat-number
                  className="font-sans"
                  style={{
                    fontSize: 'clamp(34px, 4vw, 48px)',
                    color: '#00FF88',
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                  }}
                >
                  0
                </span>
                <span
                  className="font-sans"
                  style={{
                    fontSize: 13,
                    color: '#F0F7F0',
                    opacity: 0.5,
                    lineHeight: 1.4,
                    fontWeight: 400,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha — cuerpo + cita */}
        <div ref={rightRef} className="flex flex-col" style={{ opacity: 0 }}>
          <p
            data-paragraph
            className="font-sans text-bone"
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              opacity: 0,
              fontWeight: 300,
            }}
          >
            {PARAGRAPHS[0]}
          </p>

          <blockquote
            ref={quoteRef}
            className="font-serif italic"
            style={{
              borderLeft: '2px solid #00FF88',
              paddingLeft: 24,
              fontSize: 22,
              lineHeight: 1.5,
              color: '#F0F7F0',
              fontWeight: 500,
              margin: '32px 0',
              opacity: 0,
            }}
          >
            Quien usa un reloj OBSIDIAN generalmente no lo menciona. No hace falta. El objeto ya es
            lo que es con o sin público.
          </blockquote>

          <p
            data-paragraph
            className="font-sans text-bone"
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              opacity: 0,
              fontWeight: 300,
              marginBottom: 24,
            }}
          >
            {PARAGRAPHS[1]}
          </p>

          <p
            data-paragraph
            className="font-sans text-bone"
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              opacity: 0,
              fontWeight: 300,
            }}
          >
            {PARAGRAPHS[2]}
          </p>
        </div>
      </div>
    </section>
  )
}
