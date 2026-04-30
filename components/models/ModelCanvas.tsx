'use client'

import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

export type ModelVariant = 'NOIR' | 'ALBA' | 'FORGE'

const GLOW: Record<ModelVariant, string> = {
  NOIR: '#00FF88',
  ALBA: '#D4AA60',
  FORGE: '#4488FF',
}

type Props = {
  variant: ModelVariant
  active?: boolean
  className?: string
}

/**
 * Placeholder visual del reloj — CERO Three.js, CERO WebGL.
 *
 * Genera un disco estilizado (anillos concéntricos + 12 índices + nombre
 * fantasma del modelo) con un glow de color por variante. Las animaciones
 * son CSS (rotación + pulse) y un GSAP reveal único `once: true`.
 */
export function ModelCanvas({ variant, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const indicesRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const root = rootRef.current
      if (!root) return

      // Reveal único de los índices (stagger circular).
      const ticks = indicesRef.current?.querySelectorAll<HTMLElement>('[data-tick]') ?? []
      gsap.fromTo(
        ticks,
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          stagger: noMotion ? 0 : 0.05,
          duration: noMotion ? 0.01 : 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 80%', once: true, fastScrollEnd: true },
        },
      )

      // Pulse del glow — loop ligero (opacity only, sin layout).
      if (!noMotion && glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.32,
          duration: 2.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      // Rotación lenta del anillo exterior (CSS-driven via gsap, GPU only).
      if (!noMotion && ringRef.current) {
        gsap.to(ringRef.current, {
          rotation: 360,
          duration: 60,
          ease: 'none',
          repeat: -1,
          transformOrigin: 'center center',
        })
      }
    },
    { scope: rootRef },
  )

  // Hover: intensifica el glow + leve scale (sin tocar layout, transform only).
  useEffect(() => {
    const root = rootRef.current
    const glow = glowRef.current
    if (!root || !glow) return
    const onEnter = () => {
      gsap.to(root, { scale: 1.03, duration: 0.4, ease: 'power3.out' })
      gsap.to(glow, { opacity: 0.42, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
    }
    const onLeave = () => {
      gsap.to(root, { scale: 1, duration: 0.4, ease: 'power3.out' })
      // Vuelve al pulse loop — kill local tween dejando que el repeat-yoyo siga.
      gsap.to(glow, { opacity: 0.18, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
    }
    root.addEventListener('mouseenter', onEnter)
    root.addEventListener('mouseleave', onLeave)
    return () => {
      root.removeEventListener('mouseenter', onEnter)
      root.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const glowColor = GLOW[variant]

  return (
    <div className={className ?? 'absolute inset-0 flex items-center justify-center'}>
      <div
        ref={rootRef}
        className="relative w-full mx-auto"
        style={{
          aspectRatio: '1 / 1',
          maxWidth: 420,
          willChange: 'transform',
        }}
      >
        {/* Glow de fondo */}
        <div
          ref={glowRef}
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
            opacity: 0.18,
            filter: 'blur(80px)',
            willChange: 'opacity',
          }}
        />

        {/* Anillo exterior rotando */}
        <div
          ref={ringRef}
          aria-hidden
          className="absolute"
          style={{
            inset: '8%',
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            willChange: 'transform',
          }}
        />

        {/* Anillo medio */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: '14%',
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 136, 0.15)',
          }}
        />

        {/* Cara central — fondo oscuro + nombre fantasma */}
        <div
          aria-hidden
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            inset: '20%',
            borderRadius: '50%',
            background: 'rgba(8, 8, 8, 0.85)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
            boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.6)',
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'rgba(240, 247, 240, 0.08)',
              letterSpacing: '0.3em',
              fontWeight: 700,
            }}
          >
            {variant}
          </span>
        </div>

        {/* 12 índices */}
        <div ref={indicesRef} aria-hidden className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              data-tick
              className="absolute block"
              style={{
                top: '50%',
                left: '50%',
                width: 2,
                height: i % 3 === 0 ? 12 : 8,
                backgroundColor:
                  i % 3 === 0 ? 'rgba(0, 255, 136, 0.7)' : 'rgba(0, 255, 136, 0.35)',
                transformOrigin: 'center 0',
                transform: `translate(-50%, 0) rotate(${i * 30}deg) translateY(-46%)`,
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Aguja decorativa central */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            width: 2,
            height: '32%',
            backgroundColor: 'rgba(0, 255, 136, 0.55)',
            transformOrigin: 'center bottom',
            transform: 'translate(-50%, -100%) rotate(-20deg)',
            borderRadius: 1,
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            width: 2,
            height: '24%',
            backgroundColor: 'rgba(240, 247, 240, 0.6)',
            transformOrigin: 'center bottom',
            transform: 'translate(-50%, -100%) rotate(48deg)',
            borderRadius: 1,
          }}
        />
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            backgroundColor: '#00FF88',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 12px rgba(0, 255, 136, 0.6)',
          }}
        />
      </div>
    </div>
  )
}

// Compat: la API anterior exportaba esto. Algunas secciones aún
// importan estos símbolos — devolvemos no-ops/identidad para que
// el resto del código no rompa hasta que se migre.
export const MODEL_LIGHTING = {} as const
export function getGlbUrl(_v: ModelVariant): string {
  return ''
}
