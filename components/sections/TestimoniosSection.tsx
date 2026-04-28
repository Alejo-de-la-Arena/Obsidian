'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

type Testimonial = {
  quote: string
  name: string
  role: string
  model: 'NOIR' | 'ALBA' | 'FORGE'
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Tenía dudas antes de hacer el pedido. Lo que me convenció fue la conversación inicial con el fundador. No me vendió nada. Cuando llegó el NOIR, lo primero que hice fue quitarme el Rolex que usaba todos los días. No lo he vuelto a ponérmelo.',
    name: 'Rodrigo Sáenz Valdivia',
    role: 'Ingeniero industrial · Ciudad de México',
    model: 'NOIR',
    rating: 5,
  },
  {
    quote:
      'ALBA no es un reloj de mujer ni de hombre. Es un reloj de quien aprecia la proporción. La esfera de marfil tiene un color que ninguna pantalla reproduce bien. Pregunté por una correa más delgada y me dijeron que no: el balance está calculado con esa correa específica. Aprecié esa negativa.',
    name: 'Isabel Ferreiro Montoya',
    role: 'Galerista de arte contemporáneo · Buenos Aires',
    model: 'ALBA',
    rating: 5,
  },
  {
    quote:
      'A dos años de tenerlo entiendo que la pregunta sobre el bronce era equivocada. El case no parece descuidado, parece usado. El FORGE ahora tiene marcas que vienen de mis viajes, del trabajo, del tiempo. No lo cambiaría por una versión nueva aunque pudiera.',
    name: 'Mateo Urquiza Bernal',
    role: 'Arquitecto · Bogotá',
    model: 'FORGE',
    rating: 5,
  },
]

const COMPANIES = ['ATELIER 23', 'CASA NORD', 'STUDIO REVERSO', 'OFICIO', 'BAUER & CO', 'MERIDIAN']

export function TestimoniosSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const root = sectionRef.current
      if (!root) return

      const heading = root.querySelectorAll<HTMLElement>('[data-testimonios-heading]')
      gsap.fromTo(
        heading,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: noMotion ? 0 : 0.1,
          duration: noMotion ? 0.01 : 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        },
      )

      const cards = root.querySelectorAll<HTMLElement>('[data-testimonial-card]')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: noMotion ? 0 : 0.2,
          duration: noMotion ? 0.01 : 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        },
      )

      const quotes = root.querySelectorAll<HTMLElement>('[data-decorative-quote]')
      gsap.fromTo(
        quotes,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 0.15,
          stagger: noMotion ? 0 : 0.2,
          duration: noMotion ? 0.01 : 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
          delay: noMotion ? 0 : 0.2,
        },
      )

      const logos = root.querySelectorAll<HTMLElement>('[data-company-logo]')
      gsap.fromTo(
        logos,
        { opacity: 0, y: 12 },
        {
          opacity: 0.2,
          y: 0,
          stagger: noMotion ? 0 : 0.06,
          duration: noMotion ? 0.01 : 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: root.querySelector('[data-companies]'), start: 'top 90%', once: true },
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="testimonios"
      className="relative w-full"
      style={{
        minHeight: '80vh',
        backgroundColor: '#0A0A0A',
        paddingTop: 120,
        paddingBottom: 120,
      }}
      aria-label="Testimonios OBSIDIAN"
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 1200,
          paddingLeft: 'clamp(24px, 6vw, 64px)',
          paddingRight: 'clamp(24px, 6vw, 64px)',
        }}
      >
        {/* Heading */}
        <div className="text-center mb-16">
          <p
            data-testimonios-heading
            className="font-mono mb-4"
            style={{
              fontSize: 11,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#00FF88',
              opacity: 0,
            }}
          >
            Lo que dicen quienes los usan
          </p>
          <h2
            data-testimonios-heading
            className="font-serif text-bone"
            style={{
              fontSize: 'clamp(34px, 4vw, 52px)',
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
              opacity: 0,
            }}
          >
            Tres voces. Tres relojes.
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

        {/* Logos empresas ficticias */}
        <div
          data-companies
          className="mt-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-3"
          style={{
            borderTop: '1px solid rgba(0, 255, 136, 0.08)',
            paddingTop: 40,
          }}
        >
          {COMPANIES.map((c, i) => (
            <span key={c} className="flex items-center gap-3">
              <span
                data-company-logo
                className="font-sans"
                style={{
                  fontSize: 13,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#F0F7F0',
                  opacity: 0,
                  fontWeight: 400,
                }}
              >
                {c}
              </span>
              {i < COMPANIES.length - 1 && (
                <span
                  aria-hidden
                  style={{
                    color: 'rgba(240, 247, 240, 0.15)',
                    fontSize: 12,
                  }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article
      data-testimonial-card
      className="relative flex flex-col transition-all duration-[400ms] ease-out hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(0, 255, 136, 0.08)',
        padding: '40px 32px',
        borderRadius: 16,
        opacity: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.25)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.08)'
      }}
    >
      <span
        data-decorative-quote
        aria-hidden
        className="absolute font-serif pointer-events-none select-none"
        style={{
          fontSize: 80,
          color: '#00FF88',
          opacity: 0,
          top: 8,
          left: 20,
          lineHeight: 1,
          fontWeight: 400,
        }}
      >
        “
      </span>

      <p
        className="font-serif italic relative"
        style={{
          fontSize: 20,
          lineHeight: 1.6,
          color: '#F0F7F0',
          fontWeight: 400,
          marginTop: 24,
        }}
      >
        «{t.quote}»
      </p>

      <span
        aria-hidden
        className="block"
        style={{
          width: 40,
          height: 1,
          backgroundColor: '#00FF88',
          opacity: 0.3,
          margin: '24px 0',
        }}
      />

      <p
        className="font-sans"
        style={{ fontSize: 14, color: '#F0F7F0', fontWeight: 500, marginBottom: 4 }}
      >
        {t.name}
      </p>
      <p
        className="font-sans"
        style={{ fontSize: 12, color: '#F0F7F0', opacity: 0.5, marginBottom: 16 }}
      >
        {t.role} · Modelo {t.model}
      </p>

      <div className="flex items-center gap-1.5" aria-label={`${t.rating} de 5`}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} />
        ))}
      </div>
    </article>
  )
}

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="#00FF88" aria-hidden>
      <path d="M6 0.5L7.6 4.1L11.5 4.6L8.6 7.3L9.4 11.2L6 9.2L2.6 11.2L3.4 7.3L0.5 4.6L4.4 4.1L6 0.5Z" />
    </svg>
  )
}
