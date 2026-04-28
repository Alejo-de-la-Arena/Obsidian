'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const PARAGRAPHS = [
  'Cincuenta relojes por modelo. No es una estrategia de posicionamiento. Es el límite real de lo que podemos hacer con este nivel de atención. Más allá de ese número, algo se pierde.',
  'Tres meses por reloj. El metal se trabaja sin apuro. Las decisiones se toman una a la vez. El mecanismo se ajusta hasta que el sonido es el correcto, no el aceptable.',
  'Quien usa un reloj OBSIDIAN generalmente no lo menciona. No hace falta. El objeto ya es lo que es con o sin público.',
  'Un objeto fabricado resuelve. Un objeto hecho decide. Cada curva del case, cada plano del bisel, cada textura de la correa es una decisión tomada por una persona, no por un proceso.',
]

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const signatureRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: noMotion ? 0.01 : 0.8,
            ease: 'expo.out',
            transformOrigin: 'left',
            scrollTrigger: {
              trigger: lineRef.current,
              start: 'top 85%',
              once: true,
            },
          },
        )
      }

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll<HTMLSpanElement>('[data-word]')
        gsap.fromTo(
          words,
          { clipPath: 'inset(0 0 100% 0)', y: 30 },
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            stagger: noMotion ? 0 : 0.08,
            duration: noMotion ? 0.01 : 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 80%',
              once: true,
            },
          },
        )
      }

      if (bodyRef.current) {
        const blocks = bodyRef.current.querySelectorAll<HTMLParagraphElement>('[data-paragraph]')
        gsap.fromTo(
          blocks,
          { opacity: 0, y: 24 },
          {
            opacity: 0.92,
            y: 0,
            stagger: noMotion ? 0 : 0.15,
            duration: noMotion ? 0.01 : 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bodyRef.current,
              start: 'top 75%',
              once: true,
            },
          },
        )
      }

      if (signatureRef.current) {
        gsap.fromTo(
          signatureRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: noMotion ? 0.01 : 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: signatureRef.current,
              start: 'top 90%',
              once: true,
            },
          },
        )
      }

      if (!noMotion && headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
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
      className="relative w-full flex items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        paddingTop: 'clamp(80px, 14vh, 160px)',
        paddingBottom: 'clamp(80px, 14vh, 160px)',
      }}
      aria-label="Manifiesto OBSIDIAN"
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 800,
          paddingLeft: 'clamp(24px, 6vw, 64px)',
          paddingRight: 'clamp(24px, 6vw, 64px)',
        }}
      >
        <span
          ref={lineRef}
          aria-hidden
          className="block mb-12"
          style={{
            width: 60,
            height: 1,
            backgroundColor: '#00FF88',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />

        <h2
          ref={headlineRef}
          className="font-serif text-bone mb-14 md:mb-20"
          style={{
            fontSize: 'clamp(34px, 5.5vw, 68px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        >
          {headlineWords.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span
                data-word
                className="inline-block"
                style={{
                  marginRight: i === headlineWords.length - 1 ? 0 : '0.22em',
                  willChange: 'transform, clip-path',
                }}
              >
                {w}
              </span>
            </span>
          ))}
        </h2>

        <div ref={bodyRef} className="flex flex-col gap-8 md:gap-12">
          {PARAGRAPHS.map((p, i) => (
            <p
              key={i}
              data-paragraph
              className="font-serif text-bone"
              style={{
                fontSize: 'clamp(22px, 2.6vw, 32px)',
                lineHeight: 1.45,
                fontWeight: 500,
                opacity: 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>

        <p
          ref={signatureRef}
          className="font-sans mt-16 md:mt-20"
          style={{
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#00FF88',
            fontWeight: 500,
            opacity: 0,
          }}
        >
          OBSIDIAN — Buenos Aires
        </p>
      </div>
    </section>
  )
}
