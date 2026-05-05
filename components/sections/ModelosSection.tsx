'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { WatchDisplay } from '@/components/models/WatchDisplay'

type ModelKey = 'NOIR' | 'ALBA' | 'FORGE'

type ModelData = {
  key: ModelKey
  edition: string
  tagline: string
  description: string
  specs: { label: string; value: string }[]
  price: string
  image: string
  glow: string
}

const MODELS: ModelData[] = [
  {
    key: 'NOIR',
    edition: 'Edición 01 — 50 unidades',
    tagline: 'Sin concesiones.',
    description:
      'NOIR no pretende llamar la atención. Es para quien ya tomó sus decisiones y no necesita confirmarlas con nadie. Titanio grado 5, esfera negra, cuero negro: el reloj reducido a sus elementos esenciales.',
    specs: [
      { label: 'Movimiento', value: 'ETA 6498 manual' },
      { label: 'Reserva', value: '46 horas' },
      { label: 'Resistencia', value: '5 ATM' },
      { label: 'Case', value: 'Titanio grado 5' },
      { label: 'Cristal', value: 'Zafiro AR' },
      { label: 'Correa', value: 'Cuero negro liso' },
    ],
    price: 'USD 2.800',
    image: '/images/noir-watch.png',
    glow: '#00FF88',
  },
  {
    key: 'ALBA',
    edition: 'Edición 02 — 50 unidades',
    tagline: 'Claridad sin estrépito.',
    description:
      'ALBA tiene la calidez de un objeto que envejece con gracia. La esfera de marfil no es blanca: es el color del tiempo quieto. Para quien aprecia lo que los grandes relojes clásicos prometían y rara vez cumplían.',
    specs: [
      { label: 'Movimiento', value: 'ETA 6498 manual' },
      { label: 'Reserva', value: '46 horas' },
      { label: 'Resistencia', value: '5 ATM' },
      { label: 'Case', value: 'Acero pulido' },
      { label: 'Cristal', value: 'Zafiro AR' },
      { label: 'Correa', value: 'Cuero cognac' },
    ],
    price: 'USD 4.500',
    image: '/images/alba-watch.png',
    glow: '#D4AA60',
  },
  {
    key: 'FORGE',
    edition: 'Edición 03 — 50 unidades',
    tagline: 'Bronce, tiempo, carácter.',
    description:
      'El bronce envejecido de FORGE no es una decisión estética. Es una promesa: este reloj va a cambiar. En tres años, su case va a contar algo que el tuyo no. La esfera azul medianoche y la correa NATO completan un objeto que mejora con el tiempo que mide.',
    specs: [
      { label: 'Movimiento', value: 'ETA 6498 manual' },
      { label: 'Reserva', value: '46 horas' },
      { label: 'Resistencia', value: '5 ATM' },
      { label: 'Case', value: 'Bronce envejecido' },
      { label: 'Cristal', value: 'Zafiro AR' },
      { label: 'Correa', value: 'NATO multifilamento' },
    ],
    price: 'USD 8.500',
    image: '/images/forge-watch.png',
    glow: '#4488FF',
  },
]

export function ModelosSection() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (isDesktop) return <ModelosDesktop />
  return <ModelosMobile />
}

// ──────────────────────────────────────────────────────────────────────
//   DESKTOP — horizontal scroll con pin + scrub.
// ──────────────────────────────────────────────────────────────────────
function ModelosDesktop() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const distance = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: noMotion ? 0 : 0.3,
          fastScrollEnd: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              MODELS.length - 1,
              Math.round(self.progress * (MODELS.length - 1)),
            )
            setActiveIdx(idx)
          },
        },
      })

      const onResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="modelos"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#0A0A0A', height: '100svh' }}
      aria-label="Modelos OBSIDIAN"
    >
      <div
        ref={trackRef}
        className="flex flex-row h-full"
        style={{ width: `${MODELS.length * 100}vw` }}
      >
        {MODELS.map((m) => (
          <article
            key={m.key}
            className="grid grid-cols-[55fr_45fr] items-center"
            style={{ width: '100vw', height: '100svh' }}
          >
            <div className="relative w-full h-full">
              <WatchDisplay
                src={m.image}
                alt={`Reloj ${m.key}`}
                glowColor={m.glow}
                modelName={m.key}
              />
            </div>
            <ModelInfo data={m} />
          </article>
        ))}
      </div>

      {/* Indicador de progreso */}
      <div
        className="absolute flex items-center gap-3 pointer-events-none"
        style={{ bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}
      >
        {MODELS.map((m, i) => {
          const active = i === activeIdx
          return (
            <span
              key={m.key}
              aria-hidden
              className="block rounded-full transition-all duration-300"
              style={{
                width: active ? 28 : 6,
                height: 6,
                backgroundColor: active ? '#00FF88' : 'rgba(240, 247, 240,0.25)',
              }}
            />
          )
        })}
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────────────
//   MOBILE — stack vertical: imagen arriba, texto abajo, sin alturas fijas.
// ──────────────────────────────────────────────────────────────────────
function ModelosMobile() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root) return
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const cards = root.querySelectorAll<HTMLElement>('[data-model-card]')
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: noMotion ? 0.01 : 0.7,
            ease: 'power3.out',
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
      id="modelos"
      className="relative w-full"
      style={{ backgroundColor: '#0A0A0A' }}
      aria-label="Modelos OBSIDIAN"
    >
      {MODELS.map((m, i) => (
        <article
          key={m.key}
          data-model-card
          className="flex flex-col"
          style={{
            paddingTop: 'clamp(48px, 8vh, 80px)',
            paddingBottom: i === MODELS.length - 1 ? 60 : 'clamp(32px, 6vh, 48px)',
            paddingLeft: 'clamp(20px, 6vw, 40px)',
            paddingRight: 'clamp(20px, 6vw, 40px)',
            opacity: 0,
          }}
        >
          {/* Imagen arriba */}
          <div
            className="relative w-full mx-auto mb-8"
            style={{ height: 280, maxWidth: 360 }}
          >
            <WatchDisplay
              src={m.image}
              alt={`Reloj ${m.key}`}
              glowColor={m.glow}
              modelName={m.key}
            />
          </div>

          {/* Texto abajo */}
          <ModelInfo data={m} mobile />

          {i < MODELS.length - 1 && (
            <div
              className="mx-auto mt-12"
              aria-hidden
              style={{ width: 48, height: 1, backgroundColor: '#00FF88', opacity: 0.4 }}
            />
          )}
        </article>
      ))}
    </section>
  )
}

function ModelInfo({ data, mobile = false }: { data: ModelData; mobile?: boolean }) {
  return (
    <div
      className="flex flex-col w-full"
      style={
        mobile
          ? { padding: 0 }
          : {
              justifyContent: 'center',
              paddingLeft: 'clamp(20px, 6vw, 64px)',
              paddingRight: 'clamp(20px, 6vw, 64px)',
              paddingTop: 'clamp(16px, 3vh, 32px)',
              paddingBottom: 'clamp(40px, 5vh, 32px)',
              overflowY: 'auto',
              maxHeight: '100%',
            }
      }
    >
      <p
        className="font-mono mb-2 lg:mb-3"
        style={{
          fontSize: 11,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#00FF88',
        }}
      >
        {data.edition}
      </p>

      <h3
        className="font-serif text-bone"
        style={{
          fontSize: 'clamp(40px, 12vw, 96px)',
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {data.key}
      </h3>

      <p
        className="font-serif italic mt-2 lg:mt-3"
        style={{
          fontSize: 'clamp(16px, 1.6vw, 22px)',
          color: '#00FF88',
          opacity: 0.9,
        }}
      >
        {data.tagline}
      </p>

      <span
        aria-hidden
        className="block my-4 lg:my-7"
        style={{ width: 48, height: 1, backgroundColor: 'rgba(0, 255, 136, 0.4)' }}
      />

      <p
        className="font-sans text-bone"
        style={{
          fontSize: 'clamp(14px, 1.1vw, 18px)',
          lineHeight: 1.55,
          opacity: 0.7,
          fontWeight: 300,
          maxWidth: 460,
        }}
      >
        {data.description}
      </p>

      <div
        className="grid grid-cols-2 mt-4 lg:mt-6 mb-5 lg:mb-8"
        style={{ maxWidth: 460, columnGap: 16, rowGap: 8 }}
      >
        {data.specs.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(240, 247, 240, 0.4)',
              }}
            >
              {s.label}
            </span>
            <span
              className="font-sans text-bone"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        <span
          className="font-serif"
          style={{
            fontSize: 'clamp(20px, 2vw, 28px)',
            color: '#00FF88',
            fontWeight: 700,
          }}
        >
          {data.price}
        </span>

        <a
          href="#contacto"
          data-cursor="button"
          className="font-sans transition-colors duration-200"
          style={{
            border: '1px solid rgba(0, 255, 136, 0.6)',
            color: '#00FF88',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            padding: '11px 20px',
            fontWeight: 500,
          }}
        >
          Reservar este modelo
        </a>
      </div>
    </div>
  )
}
