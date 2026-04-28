'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

type Stage = {
  number: string
  title: string
  description: string
  detail: string
  side: 'left' | 'right' // posición del texto
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
  const sectionRef = useRef<HTMLElement>(null)
  const stagesRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (isDesktop) {
        // Pin + scrub: cada etapa ocupa 1/4 del tramo de scroll.
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: noMotion ? 0 : 1,
          pin: stagesRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              STAGES.length - 1,
              Math.floor(self.progress * STAGES.length - 0.0001),
            )
            setActiveIdx(idx < 0 ? 0 : idx)
          },
        })

        const onResize = () => ScrollTrigger.refresh()
        window.addEventListener('resize', onResize)
        return () => {
          window.removeEventListener('resize', onResize)
          trigger.kill()
        }
      }

      // Mobile: reveal de cada etapa por scroll.
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>('[data-stage-mobile]')
      if (!cards) return
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: noMotion ? 0.01 : 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              once: true,
            },
          },
        )
      })
    },
    { scope: sectionRef, dependencies: [isDesktop] },
  )

  if (!isDesktop) {
    return (
      <section
        ref={sectionRef}
        id="proceso"
        className="relative w-full"
        style={{ backgroundColor: '#0A0A0A' }}
        aria-label="Proceso de fabricación OBSIDIAN"
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 720,
            paddingLeft: 'clamp(24px, 6vw, 48px)',
            paddingRight: 'clamp(24px, 6vw, 48px)',
            paddingTop: 'clamp(64px, 10vh, 120px)',
            paddingBottom: 'clamp(64px, 10vh, 120px)',
          }}
        >
          <SectionHeading />
          <div className="flex flex-col gap-20">
            {STAGES.map((s) => (
              <article
                key={s.number}
                data-stage-mobile
                className="relative flex flex-col gap-6"
                style={{ opacity: 0 }}
              >
                <div
                  className="absolute font-serif pointer-events-none select-none"
                  aria-hidden
                  style={{
                    fontSize: 'clamp(120px, 30vw, 180px)',
                    color: '#00FF88',
                    opacity: 0.06,
                    top: -20,
                    left: -8,
                    lineHeight: 1,
                    fontWeight: 400,
                  }}
                >
                  {s.number}
                </div>
                <StageIllustration icon={s.icon} />
                <p
                  className="font-mono"
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
                  className="font-serif text-bone"
                  style={{
                    fontSize: 'clamp(34px, 7vw, 48px)',
                    lineHeight: 1.05,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="font-sans text-bone"
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
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

  // Desktop: 5x altura para el scroll.
  return (
    <section
      ref={sectionRef}
      id="proceso"
      className="relative w-full"
      style={{ height: `${STAGES.length * 100}vh`, backgroundColor: '#0A0A0A' }}
      aria-label="Proceso de fabricación OBSIDIAN"
    >
      <div
        ref={stagesRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Heading flotante */}
        <div
          className="absolute z-10"
          style={{
            top: 'clamp(40px, 6vh, 64px)',
            left: 'clamp(32px, 8vw, 80px)',
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(240, 247, 240, 0.4)',
            }}
          >
            El Proceso
          </p>
        </div>

        {/* Número decorativo grande */}
        <div
          aria-hidden
          className="absolute font-serif pointer-events-none select-none"
          style={{
            fontSize: 'clamp(180px, 22vw, 320px)',
            color: '#00FF88',
            opacity: 0.06,
            fontWeight: 700,
            bottom: '-2vh',
            left: '50%',
            transform: 'translateX(-50%)',
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          {STAGES[activeIdx].number}
        </div>

        {/* Etapas absolutas, transición por activeIdx */}
        {STAGES.map((s, i) => {
          const active = i === activeIdx
          const before = i < activeIdx
          return (
            <article
              key={s.number}
              className="absolute inset-0 grid items-center pointer-events-none"
              style={{
                gridTemplateColumns: '1fr 1fr',
                paddingLeft: 'clamp(48px, 8vw, 128px)',
                paddingRight: 'clamp(48px, 8vw, 128px)',
                gap: '6vw',
                zIndex: active ? 3 : 1,
              }}
            >
              {/* Columna texto */}
              <div
                style={{
                  gridColumn: s.side === 'left' ? '1 / 2' : '2 / 3',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateY(0)' : `translateY(${before ? -20 : 20}px)`,
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                  pointerEvents: active ? 'auto' : 'none',
                }}
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
                    fontSize: 'clamp(40px, 4vw, 56px)',
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
                    fontSize: 18,
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

              {/* Columna ilustración */}
              <div
                className="relative w-full"
                style={{
                  gridColumn: s.side === 'left' ? '2 / 3' : '1 / 2',
                  gridRow: 1,
                  aspectRatio: '4 / 3',
                  clipPath: active
                    ? 'inset(0 0% 0 0)'
                    : before
                      ? 'inset(0 100% 0 0)'
                      : 'inset(0 0 0 100%)',
                  transition: 'clip-path 0.9s cubic-bezier(0.6, 0.02, 0.18, 1)',
                }}
              >
                <StageIllustration icon={s.icon} />
              </div>
            </article>
          )
        })}

        {/* Indicador de etapas */}
        <div
          className="absolute flex items-center gap-2 pointer-events-none"
          style={{
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
          }}
        >
          {STAGES.map((s, i) => (
            <span
              key={s.number}
              aria-hidden
              className="block transition-all duration-300"
              style={{
                width: 32,
                height: 1,
                backgroundColor: i === activeIdx ? '#00FF88' : '#2A2A2A',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionHeading() {
  return (
    <div className="mb-16 md:mb-20">
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
          fontSize: 'clamp(34px, 7vw, 56px)',
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

function StageIllustration({ icon }: { icon: Stage['icon'] }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        aspectRatio: '4 / 3',
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
      {/* Esquinas decorativas */}
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
        fontFamily="serif"
        fontSize="18"
        fill={STROKE}
        opacity="0.8"
      >
        №
      </text>
    </svg>
  )
}
