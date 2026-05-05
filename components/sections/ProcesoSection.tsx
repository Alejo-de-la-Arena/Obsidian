'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

type Stage = {
  number: string
  title: string
  description: string
  detail: string
  side: 'left' | 'right'
  icon: 'compass' | 'gear' | 'lens' | 'box'
}

const STAGES: Stage[] = [
  {
    number: '01',
    title: 'Diseño',
    description:
      'Todo empieza en papel. No en pantalla. El boceto define la proporción del case, el ángulo del bisel, el grosor de las agujas. Cada decisión formal tiene una razón que no es solo estética: es mecánica, ergonómica, duradera.',
    detail: '~ 6 semanas de bocetado y prototipado en papel',
    side: 'left',
    icon: 'compass',
  },
  {
    number: '02',
    title: 'Mecanismo',
    description:
      'El movimiento mecánico manual no necesita batería porque no quiere comodidad: quiere precisión. Cada pieza del tren de engranajes se ajusta a mano. El resultado es un objeto que vive: late, avanza, se atrasa si no se lo cuida.',
    detail: 'ETA 6498 — 17 jewels · 18.000 vph',
    side: 'right',
    icon: 'gear',
  },
  {
    number: '03',
    title: 'Acabado',
    description:
      'La superficie de un reloj es donde el ojo descansa. Por eso cada milímetro se decide. Los planos del case se pulen o se sandblastean según lo que deba comunicar esa cara específica. No hay una textura por defecto.',
    detail: 'Pulido espejo · Cepillado · Sandblast · Decisión por plano',
    side: 'left',
    icon: 'lens',
  },
  {
    number: '04',
    title: 'Numeración',
    description:
      'En el momento en que el número se graba, el reloj deja de ser una pieza de producción y se convierte en un objeto específico. El 23 de 50 no es el 24 de 50. Nunca lo será. Esa numeración no es marketing: es el acto que hace que el reloj sea tuyo.',
    detail: 'Grabado láser fibra · Tu número, tu reloj',
    side: 'right',
    icon: 'box',
  },
]

export function ProcesoSection() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (!isDesktop) return <ProcesoMobile />
  return <ProcesoDesktop />
}

// ──────────────────────────────────────────────────────────────────────
//   DESKTOP — versión original (no se toca: cards apilados con reveal).
// ──────────────────────────────────────────────────────────────────────
function ProcesoDesktop() {
  const sectionRef = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const root = sectionRef.current
      if (!root) return

      const cards = root.querySelectorAll<HTMLElement>('[data-stage]')
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: noMotion ? 0.01 : 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              once: true,
              fastScrollEnd: true,
            },
          },
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="proceso"
      className="relative w-full"
      style={{
        backgroundColor: '#0A0A0A',
        paddingTop: 'clamp(80px, 12vh, 140px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)',
      }}
      aria-label="Proceso de fabricación OBSIDIAN"
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 1200,
          paddingLeft: 'clamp(24px, 6vw, 64px)',
          paddingRight: 'clamp(24px, 6vw, 64px)',
        }}
      >
        <SectionHeading />

        <div className="flex flex-col gap-24 md:gap-32 mt-16 md:mt-24">
          {STAGES.map((s) => (
            <article
              key={s.number}
              data-stage
              className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16"
              style={{ opacity: 0 }}
            >
              {/* Número decorativo gigante de fondo */}
              <span
                aria-hidden
                className="absolute font-serif pointer-events-none select-none"
                style={{
                  fontSize: 'clamp(140px, 22vw, 260px)',
                  color: '#00FF88',
                  opacity: 0.06,
                  top: '-12%',
                  left: s.side === 'left' ? '-2%' : 'auto',
                  right: s.side === 'right' ? '-2%' : 'auto',
                  lineHeight: 1,
                  fontWeight: 700,
                  zIndex: 0,
                }}
              >
                {s.number}
              </span>

              {/* Texto */}
              <div
                className="relative z-10"
                style={{ order: s.side === 'left' ? 0 : 1 }}
              >
                <p
                  className="font-mono mb-4"
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.4em',
                    textTransform: 'uppercase',
                    color: '#00FF88',
                  }}
                >
                  Etapa {s.number}
                </p>
                <h3
                  className="font-serif text-bone mb-6"
                  style={{
                    fontSize: 'clamp(34px, 5vw, 56px)',
                    lineHeight: 1.05,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="font-sans text-bone mb-6"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    opacity: 0.7,
                    fontWeight: 300,
                    maxWidth: 480,
                  }}
                >
                  {s.description}
                </p>
                <p
                  className="font-mono"
                  style={{
                    fontSize: 13,
                    letterSpacing: '0.15em',
                    color: '#00FF88',
                  }}
                >
                  {s.detail}
                </p>
              </div>

              {/* Ilustración */}
              <div className="relative z-10" style={{ order: s.side === 'left' ? 1 : 0 }}>
                <StageIllustration icon={s.icon} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────────────
//   MOBILE — 4 cards en scroll vertical normal, sin pin, sin scrub.
//   Cada card se revela al entrar al viewport.
// ──────────────────────────────────────────────────────────────────────
function ProcesoMobile() {
  const sectionRef = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root) return
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const cards = root.querySelectorAll<HTMLElement>('[data-etapa]')
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: noMotion ? 0.01 : 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 82%', once: true, fastScrollEnd: true },
          },
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="proceso"
      className="relative w-full"
      style={{
        backgroundColor: '#0A0A0A',
        paddingTop: 'clamp(72px, 10vh, 110px)',
        paddingBottom: 'clamp(72px, 10vh, 110px)',
      }}
      aria-label="Proceso de fabricación OBSIDIAN"
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 720,
          paddingLeft: 'clamp(20px, 6vw, 40px)',
          paddingRight: 'clamp(20px, 6vw, 40px)',
        }}
      >
        {/* Heading */}
        <div className="mb-12">
          <span
            aria-hidden
            className="block mb-5"
            style={{ width: 48, height: 1, backgroundColor: '#00FF88' }}
          />
          <p
            className="font-mono mb-3"
            style={{
              fontSize: 10,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#00FF88',
            }}
          >
            El Proceso
          </p>
          <h2
            className="font-serif text-bone"
            style={{
              fontSize: 'clamp(28px, 7vw, 36px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontWeight: 700,
            }}
          >
            Cuatro etapas. Tres meses por reloj.
          </h2>
        </div>

        {/* 4 cards */}
        <div className="flex flex-col gap-4">
          {STAGES.map((s) => (
            <article
              key={s.number}
              data-etapa
              className="relative overflow-hidden"
              style={{
                background: 'rgba(0, 255, 136, 0.02)',
                border: '1px solid rgba(0, 255, 136, 0.08)',
                borderRadius: 12,
                padding: '32px 24px',
                opacity: 0,
              }}
            >
              {/* Número decorativo */}
              <span
                aria-hidden
                className="absolute font-serif pointer-events-none select-none"
                style={{
                  fontSize: 72,
                  color: '#00FF88',
                  opacity: 0.06,
                  top: -8,
                  right: 12,
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                {s.number}
              </span>

              <p
                className="font-mono mb-3"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#00FF88',
                }}
              >
                Etapa {s.number}
              </p>
              <h3
                className="font-serif text-bone mb-4"
                style={{
                  fontSize: 24,
                  lineHeight: 1.1,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                {s.title}
              </h3>
              <p
                className="font-sans text-bone mb-4"
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  opacity: 0.65,
                  fontWeight: 300,
                }}
              >
                {s.description}
              </p>
              <p
                className="font-mono"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.15em',
                  color: '#00FF88',
                  opacity: 0.85,
                }}
              >
                {s.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionHeading() {
  return (
    <div className="max-w-2xl">
      <span
        aria-hidden
        className="block mb-6"
        style={{ width: 48, height: 1, backgroundColor: '#00FF88' }}
      />
      <p
        className="font-mono mb-3"
        style={{
          fontSize: 11,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#00FF88',
        }}
      >
        El Proceso
      </p>
      <h2
        className="font-serif text-bone"
        style={{
          fontSize: 'clamp(34px, 5.5vw, 56px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          fontWeight: 700,
        }}
      >
        Cuatro etapas. Tres meses por reloj.
      </h2>
    </div>
  )
}

function StageIllustration({ icon, compact = false }: { icon: Stage['icon']; compact?: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: compact ? '16 / 9' : '4 / 3',
        background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
        border: '1px solid rgba(0, 255, 136, 0.15)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {icon === 'compass' && <CompassSvg />}
        {icon === 'gear' && <GearSvg />}
        {icon === 'lens' && <LensSvg />}
        {icon === 'box' && <BoxSvg />}
      </div>
      {(['tl', 'tr', 'bl', 'br'] as const).map((p) => (
        <span
          key={p}
          aria-hidden
          className="absolute"
          style={{
            width: 12,
            height: 12,
            borderColor: 'rgba(0, 255, 136, 0.45)',
            borderStyle: 'solid',
            borderWidth: 0,
            ...(p === 'tl' && { top: 12, left: 12, borderTopWidth: 1, borderLeftWidth: 1 }),
            ...(p === 'tr' && { top: 12, right: 12, borderTopWidth: 1, borderRightWidth: 1 }),
            ...(p === 'bl' && { bottom: 12, left: 12, borderBottomWidth: 1, borderLeftWidth: 1 }),
            ...(p === 'br' && { bottom: 12, right: 12, borderBottomWidth: 1, borderRightWidth: 1 }),
          }}
        />
      ))}
    </div>
  )
}

const STROKE = '#00FF88'

function CompassSvg() {
  return (
    <svg width="42%" viewBox="0 0 200 200" fill="none" aria-hidden>
      <circle cx="100" cy="100" r="78" stroke={STROKE} strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="48" stroke={STROKE} strokeWidth="1" opacity="0.7" />
      <line x1="100" y1="22" x2="100" y2="178" stroke={STROKE} strokeWidth="0.5" opacity="0.4" />
      <line x1="22" y1="100" x2="178" y2="100" stroke={STROKE} strokeWidth="0.5" opacity="0.4" />
      <circle cx="100" cy="100" r="3" fill={STROKE} />
      <path d="M100 52 L106 100 L100 96 L94 100 Z" fill={STROKE} />
    </svg>
  )
}

function GearSvg() {
  const teeth = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg width="42%" viewBox="0 0 200 200" fill="none" aria-hidden>
      <g>
        {teeth.map((deg) => (
          <rect
            key={deg}
            x="96"
            y="14"
            width="8"
            height="20"
            fill={STROKE}
            opacity="0.7"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </g>
      <circle cx="100" cy="100" r="68" fill="none" stroke={STROKE} strokeWidth="1" />
      <circle cx="100" cy="100" r="32" fill="none" stroke={STROKE} strokeWidth="1" opacity="0.7" />
      <circle cx="100" cy="100" r="6" fill={STROKE} />
    </svg>
  )
}

function LensSvg() {
  return (
    <svg width="42%" viewBox="0 0 200 200" fill="none" aria-hidden>
      <circle cx="84" cy="84" r="48" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="84" cy="84" r="34" stroke={STROKE} strokeWidth="0.5" opacity="0.5" />
      <line
        x1="120"
        y1="120"
        x2="170"
        y2="170"
        stroke={STROKE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="74" cy="74" r="6" fill={STROKE} opacity="0.3" />
    </svg>
  )
}

function BoxSvg() {
  return (
    <svg width="42%" viewBox="0 0 200 200" fill="none" aria-hidden>
      <path d="M40 70 L100 40 L160 70 L160 140 L100 170 L40 140 Z" stroke={STROKE} strokeWidth="1" />
      <path d="M40 70 L100 100 L160 70" stroke={STROKE} strokeWidth="1" opacity="0.7" />
      <path d="M100 100 L100 170" stroke={STROKE} strokeWidth="1" opacity="0.7" />
      <text
        x="100"
        y="125"
        textAnchor="middle"
        fontFamily="var(--font-space-grotesk), sans-serif"
        fontSize="18"
        fill={STROKE}
        opacity="0.8"
      >
        №
      </text>
    </svg>
  )
}
