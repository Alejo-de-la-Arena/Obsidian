'use client'

import { FormEvent, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

export function ContactoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const root = sectionRef.current
      if (!root) return

      const heading = root.querySelectorAll<HTMLElement>('[data-contacto-heading]')
      gsap.fromTo(
        heading,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: noMotion ? 0 : 0.12,
          duration: noMotion ? 0.01 : 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      )

      const fields = root.querySelectorAll<HTMLElement>('[data-form-field]')
      gsap.fromTo(
        fields,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: noMotion ? 0 : 0.1,
          duration: noMotion ? 0.01 : 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 65%', once: true },
        },
      )

      const lines = root.querySelectorAll<HTMLElement>('[data-field-line]')
      gsap.fromTo(
        lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          stagger: noMotion ? 0 : 0.1,
          duration: noMotion ? 0.01 : 0.8,
          ease: 'expo.out',
          transformOrigin: 'left',
          scrollTrigger: { trigger: root, start: 'top 65%', once: true },
        },
      )

      const cta = root.querySelectorAll<HTMLElement>('[data-form-cta]')
      gsap.fromTo(
        cta,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: noMotion ? 0.01 : 0.8,
          ease: 'power3.out',
          delay: noMotion ? 0 : 0.4,
          scrollTrigger: { trigger: root, start: 'top 60%', once: true },
        },
      )
    },
    { scope: sectionRef },
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    gsap.to(formRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setSubmitted(true)
        requestAnimationFrame(() => {
          if (successRef.current) {
            gsap.fromTo(
              successRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            )
          }
        })
      },
    })
  }

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        paddingTop: 120,
        paddingBottom: 120,
      }}
      aria-label="Contacto OBSIDIAN"
    >
      {/* Partículas sutiles decorativas — CSS only, livianas */}
      <Particles />

      <div
        className="relative w-full text-center"
        style={{
          maxWidth: 640,
          paddingLeft: 'clamp(24px, 6vw, 48px)',
          paddingRight: 'clamp(24px, 6vw, 48px)',
          zIndex: 2,
        }}
      >
        <p
          data-contacto-heading
          className="font-mono mb-5"
          style={{
            fontSize: 11,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#00FF88',
            opacity: 0,
          }}
        >
          Lista de espera privada
        </p>

        <h2
          data-contacto-heading
          className="font-serif text-bone mb-6"
          style={{
            fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            fontWeight: 700,
            opacity: 0,
          }}
        >
          Tu próximo reloj todavía no existe.{' '}
          <span style={{ fontStyle: 'italic' }}>Hablemos.</span>
        </h2>

        <p
          data-contacto-heading
          className="font-sans text-bone mx-auto mb-12"
          style={{
            fontSize: 'clamp(16px, 1.2vw, 18px)',
            lineHeight: 1.7,
            opacity: 0.6,
            fontWeight: 300,
            maxWidth: 480,
          }}
        >
          Respondemos en 48 horas. La primera conversación es con el fundador, no con un sistema
          automatizado.
        </p>

        {!submitted ? (
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="flex flex-col text-left"
            noValidate
          >
            <FormField label="Nombre completo" id="contact-name" type="text" />
            <FormField label="Correo electrónico" id="contact-email" type="email" required />

            <div data-form-field className="relative mb-10" style={{ opacity: 0 }}>
              <label
                htmlFor="contact-model"
                className="font-mono block mb-3"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(240, 247, 240, 0.5)',
                }}
              >
                Modelo de interés
              </label>
              <div className="relative">
                <select
                  id="contact-model"
                  defaultValue=""
                  data-cursor="button"
                  className="font-sans w-full appearance-none bg-transparent"
                  style={{
                    color: '#F0F7F0',
                    fontSize: 16,
                    padding: '16px 24px 16px 0',
                    border: 'none',
                    outline: 'none',
                    borderBottom: '1px solid transparent',
                  }}
                >
                  <option value="" disabled style={{ background: '#0A0A0A' }}>
                    Seleccionar
                  </option>
                  <option value="NOIR" style={{ background: '#0A0A0A' }}>
                    NOIR
                  </option>
                  <option value="ALBA" style={{ background: '#0A0A0A' }}>
                    ALBA
                  </option>
                  <option value="FORGE" style={{ background: '#0A0A0A' }}>
                    FORGE
                  </option>
                  <option value="any" style={{ background: '#0A0A0A' }}>
                    Cualquiera
                  </option>
                </select>

                {/* Línea inferior animada */}
                <span
                  data-field-line
                  aria-hidden
                  className="absolute left-0 right-0 bottom-0 block"
                  style={{
                    height: 1,
                    backgroundColor: 'rgba(240, 247, 240, 0.2)',
                    transformOrigin: 'left',
                    transform: 'scaleX(0)',
                  }}
                />
                <svg
                  aria-hidden
                  className="absolute pointer-events-none"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
                >
                  <path
                    d="M1 1l5 5 5-5"
                    stroke="#00FF88"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <button
              data-form-cta
              data-cursor="button"
              type="submit"
              className="font-sans w-full transition-all duration-200"
              style={{
                backgroundColor: '#00FF88',
                color: '#0A0A0A',
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: 18,
                fontWeight: 600,
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00CC6A'
                e.currentTarget.style.transform = 'scale(1.01)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00FF88'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Solicitar información
            </button>

            <p
              data-form-cta
              className="font-sans text-center mt-6"
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                color: 'rgba(240, 247, 240, 0.3)',
                opacity: 0,
              }}
            >
              Sin compromiso · Respondemos en 48 horas · Información confidencial
            </p>
          </form>
        ) : (
          <div ref={successRef} className="flex flex-col items-center" style={{ opacity: 0 }}>
            <span
              aria-hidden
              className="block mb-8"
              style={{ width: 60, height: 1, backgroundColor: '#00FF88' }}
            />
            <p
              className="font-serif italic"
              style={{
                fontSize: 24,
                lineHeight: 1.5,
                color: '#F0F7F0',
                fontWeight: 500,
                maxWidth: 480,
              }}
            >
              Tu solicitud fue recibida. Te contactaremos en las próximas 48 horas.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function FormField({
  label,
  id,
  type,
  required,
}: {
  label: string
  id: string
  type: string
  required?: boolean
}) {
  return (
    <div data-form-field className="relative mb-10" style={{ opacity: 0 }}>
      <label
        htmlFor={id}
        className="font-mono block mb-3"
        style={{
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(240, 247, 240, 0.5)',
        }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          required={required}
          autoComplete="off"
          className="font-sans w-full bg-transparent"
          style={{
            color: '#F0F7F0',
            fontSize: 16,
            padding: '16px 0',
            border: 'none',
            outline: 'none',
          }}
          onFocus={(e) => {
            const line = e.currentTarget.parentElement?.querySelector(
              '[data-field-line]',
            ) as HTMLElement | null
            if (line) line.style.backgroundColor = '#00FF88'
          }}
          onBlur={(e) => {
            const line = e.currentTarget.parentElement?.querySelector(
              '[data-field-line]',
            ) as HTMLElement | null
            if (line) line.style.backgroundColor = 'rgba(240, 247, 240, 0.2)'
          }}
        />
        <span
          data-field-line
          aria-hidden
          className="absolute left-0 right-0 bottom-0 block transition-colors duration-300"
          style={{
            height: 1,
            backgroundColor: 'rgba(240, 247, 240, 0.2)',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  )
}

function Particles() {
  // Partículas decorativas estáticas (CSS) — 40 puntos.
  const items = Array.from({ length: 40 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280
    const r = seed / 233280
    const left = (i * 37) % 100
    const top = ((i * 53) % 100 + r * 12) % 100
    const size = 1 + (i % 3)
    const delay = (i % 7) * 0.6
    return { left, top, size, delay }
  })
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.3 }}
    >
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-pulse-seiko"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#00FF88',
            opacity: 0.4,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
