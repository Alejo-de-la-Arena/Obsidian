'use client'

import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { MagneticButton } from './MagneticButton'

export function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const eyebrowLineRef = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const sublineRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        delay: noMotion ? 0 : 0.4,
      })

      tl.fromTo(
        statusRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: noMotion ? 0.01 : 0.6 },
        0,
      )

      tl.fromTo(
        eyebrowLineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: noMotion ? 0.01 : 0.8, transformOrigin: 'left' },
        0.15,
      ).fromTo(
        eyebrowRef.current,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: noMotion ? 0.01 : 0.6 },
        0.3,
      )

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll<HTMLSpanElement>('[data-word]')
        tl.fromTo(
          words,
          { clipPath: 'inset(0 0 100% 0)', y: 40 },
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            stagger: noMotion ? 0 : 0.08,
            duration: noMotion ? 0.01 : 1,
          },
          0.5,
        )
      }

      tl.fromTo(
        sublineRef.current,
        { opacity: 0, y: 16 },
        { opacity: 0.78, y: 0, duration: noMotion ? 0.01 : 0.8 },
        1.0,
      )

      if (ctasRef.current) {
        const targets = Array.from(ctasRef.current.children)
        tl.fromTo(
          targets,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: noMotion ? 0 : 0.1, duration: noMotion ? 0.01 : 0.7 },
          1.15,
        )
      }

      if (metaRef.current) {
        const items = metaRef.current.querySelectorAll('[data-meta-item]')
        tl.fromTo(
          items,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            stagger: noMotion ? 0 : 0.08,
            duration: noMotion ? 0.01 : 0.7,
          },
          1.3,
        )
      }

      tl.fromTo(
        scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: noMotion ? 0.01 : 0.6 },
        1.6,
      )

      if (!noMotion && scrollLineRef.current) {
        gsap.fromTo(
          scrollLineRef.current,
          { scaleY: 0.15 },
          {
            scaleY: 1,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: 'top',
            delay: 2.2,
          },
        )
      }
    },
    { scope: containerRef },
  )

  // Fallback de seguridad: si después de 3s algún elemento `.hero-animated`
  // sigue con opacity 0, le ponemos la clase `is-fallback-visible` que en
  // globals.css fuerza opacity:1 y transform:none. Garantiza que el hero
  // jamás quede invisible aunque GSAP no ejecute por SSR/strict mode/error.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const root = containerRef.current
      if (!root) return
      root.querySelectorAll<HTMLElement>('.hero-animated').forEach((el) => {
        if (getComputedStyle(el).opacity === '0') {
          el.classList.add('is-fallback-visible')
        }
      })
      // Children de contenedores stagger (CTAs).
      root.querySelectorAll<HTMLElement>('.hero-animated-children').forEach((parent) => {
        Array.from(parent.children).forEach((child) => {
          const el = child as HTMLElement
          if (getComputedStyle(el).opacity === '0') {
            el.style.opacity = '1'
            el.style.transform = 'none'
          }
        })
      })
      // Doble red: el meta div también si quedó invisible.
      if (metaRef.current && getComputedStyle(metaRef.current).opacity === '0') {
        metaRef.current.style.opacity = '1'
      }
    }, 3000)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top -100px',
      onEnter: () =>
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          pointerEvents: 'none',
        }),
      onLeaveBack: () =>
        gsap.to(scrollHintRef.current, {
          opacity: 1,
          duration: 0.4,
          pointerEvents: 'auto',
        }),
    })
    return () => st.kill()
  }, [])

  const headlineLines: { text: string; italic: boolean }[][] = [
    [
      { text: 'Un', italic: false },
      { text: 'objeto', italic: false },
      { text: 'hecho.', italic: false },
    ],
    [
      { text: 'No', italic: true },
      { text: 'fabricado.', italic: true },
    ],
  ]

  return (
    <div
      ref={containerRef}
      className="relative md:absolute md:inset-0 pointer-events-none"
      style={{ zIndex: 3 }}
    >
      <div
        className="relative md:absolute pointer-events-auto flex flex-col w-full pt-[clamp(72px,9vh,108px)] md:pt-[clamp(60px,7vh,100px)] pb-[clamp(28px,5vh,72px)] md:pb-[clamp(24px,4vh,60px)]"
        style={{
          paddingLeft: 'clamp(20px, 6vw, 96px)',
          paddingRight: 'clamp(20px, 6vw, 96px)',
          maxWidth: 'min(680px, 100%)',
        }}
      >
        {/* Status pill — sobre el badge eyebrow, en flujo */}
        <div
          ref={statusRef}
          className="hero-animated flex items-center gap-2.5 font-mono mb-4 md:mb-6"
          style={{
            fontSize: 10,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(240, 247, 240, 0.6)',
          }}
        >
          <span
            className="relative inline-flex items-center justify-center"
            style={{ width: 10, height: 10 }}
          >
            <span
              className="absolute inset-0 rounded-full animate-pulse-seiko"
              style={{ backgroundColor: '#00FF88', opacity: 0.35 }}
            />
            <span
              className="relative rounded-full"
              style={{ width: 5, height: 5, backgroundColor: '#00FF88' }}
            />
          </span>
          <span>En producción · 12 unidades restantes</span>
        </div>

        {/* Eyebrow línea + label */}
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <span
            ref={eyebrowLineRef}
            aria-hidden
            className="block"
            style={{
              width: 42,
              height: 1,
              backgroundColor: '#00FF88',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
            }}
          />
          <p
            ref={eyebrowRef}
            className="hero-animated font-mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#00FF88',
              fontWeight: 500,
            }}
          >
            Buenos Aires · Edición limitada
          </p>
        </div>

        {/* H1 */}
        <h1
          ref={headlineRef}
          className="font-serif text-bone leading-[1.08] md:leading-[1.1] pb-[0.1em] md:pb-[0.15em]"
          style={{
            fontSize: 'clamp(34px, min(7vw, 9vh), 78px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 'clamp(8px, 1.5vh, 20px)',
          }}
        >
          {headlineLines.map((line, lineIdx) => (
            <span key={lineIdx} className="block" style={{ overflow: 'visible' }}>
              {line.map((w, i) => (
                <span
                  key={`${lineIdx}-${i}`}
                  data-word
                  className="inline-block"
                  style={{
                    marginRight: i === line.length - 1 ? 0 : '0.22em',
                    fontStyle: w.italic ? 'italic' : 'normal',
                    paddingBottom: '0.08em',
                    willChange: 'transform, clip-path',
                  }}
                >
                  {w.text}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subline */}
        <p
          ref={sublineRef}
          className="hero-animated font-sans text-bone leading-[1.55] md:leading-[1.65]"
          style={{
            fontSize: 'clamp(14px, 1.25vw, 19px)',
            maxWidth: 460,
            fontWeight: 300,
            marginBottom: 'clamp(8px, 1.5vh, 16px)',
          }}
        >
          Relojes mecánicos de edición limitada, hechos a mano en Buenos Aires.
          <span className="block mt-1 text-bone/50">
            Máximo 50 unidades por modelo · Movimiento automático suizo.
          </span>
        </p>

        {/* CTAs — stack vertical full-width en mobile, horizontal en sm+ */}
        <div
          ref={ctasRef}
          className="hero-animated-children flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"
          style={{
            marginTop: 'clamp(12px, 2vh, 28px)',
            marginBottom: 'clamp(16px, 2.5vh, 36px)',
          }}
        >
          <MagneticButton href="#modelos" variant="primary" fullWidthMobile>
            Ver los relojes
            <ArrowRight className="btn-arrow" />
          </MagneticButton>

          <MagneticButton href="#edicion-limitada" variant="secondary" fullWidthMobile>
            Reservar un lugar
          </MagneticButton>
        </div>

        {/* Meta */}
        <div
          ref={metaRef}
          className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-3 sm:gap-y-4"
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: 'clamp(16px, 2.5vh, 36px)',
          }}
        >
          {[
            ['01', 'Modelos', '3'],
            ['02', 'Unidades', '≤ 50'],
            ['03', 'Desde', 'USD 2.800'],
          ].map(([index, label, value]) => (
            <div
              key={label}
              data-meta-item
              className="hero-animated flex flex-col gap-1.5 pl-4"
              style={{
                borderLeft: '1px solid rgba(0, 255, 136, 0.35)',
              }}
            >
              <span className="font-mono text-seiko" style={{ fontSize: 10 }}>
                {index}
              </span>
              <span className="font-mono text-bone/40">{label}</span>
              <span
                className="font-sans text-bone"
                style={{ fontSize: 14, letterSpacing: '0.06em', fontWeight: 500 }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint — solo desktop */}
      <div
        ref={scrollHintRef}
        className="hero-animated absolute hidden md:flex flex-col items-center gap-3 pointer-events-none"
        style={{
          zIndex: 3,
          bottom: '40px',
          right: 'clamp(24px, 4vw, 64px)',
        }}
      >
        <span
          className="font-mono text-bone/50"
          style={{
            fontSize: 10,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <div
          ref={scrollLineRef}
          style={{
            width: 1,
            height: 56,
            background: 'linear-gradient(180deg, #00FF88 0%, rgba(0, 255, 136,0) 100%)',
            transformOrigin: 'top',
          }}
        />
      </div>
    </div>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 7h12m0 0L8 2m5 5l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
