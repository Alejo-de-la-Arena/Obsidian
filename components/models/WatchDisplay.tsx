'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

interface WatchDisplayProps {
  src: string
  alt: string
  glowColor: string
  modelName: string
}

/**
 * WatchDisplay — la imagen del reloj es estática; lo que vive alrededor
 * es el ambiente: glow, anillos en rotación lenta, partículas y un
 * shimmer al hacer hover. Cero WebGL, todo CSS + GSAP transform/opacity.
 */
export function WatchDisplay({ src, alt, glowColor, modelName }: WatchDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const glowInnerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const shimmerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<(HTMLDivElement | null)[]>([])
  const rotationTween = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      // Anillo exterior (siempre rota — lento).
      rotationTween.current = gsap.to(ringRef.current, {
        rotation: 360,
        duration: noMotion ? 0 : 20,
        repeat: noMotion ? 0 : -1,
        ease: 'none',
      })

      // Anillo interior — sentido contrario, más lento.
      gsap.to(ring2Ref.current, {
        rotation: -360,
        duration: noMotion ? 0 : 35,
        repeat: noMotion ? 0 : -1,
        ease: 'none',
      })

      // Glow base pulsante — más sutil.
      if (!noMotion) {
        gsap.to(glowRef.current, {
          opacity: 0.18,
          scale: 1.04,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Partículas idle — sutiles, casi invisibles.
      if (!noMotion) {
        particlesRef.current.forEach((p, i) => {
          if (!p) return
          gsap.to(p, {
            y: 'random(-8, 8)',
            x: 'random(-6, 6)',
            opacity: 'random(0.05, 0.15)',
            duration: 'random(2.5, 4.5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3,
          })
        })
      }
    }, container)

    const onEnter = () => {
      gsap.to(glowRef.current, {
        opacity: 0.3,
        scale: 1.15,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      })
      gsap.to(glowInnerRef.current, {
        opacity: 0.2,
        scale: 1.0,
        duration: 0.5,
        ease: 'power2.out',
      })
      gsap.to(imageRef.current, {
        scale: 1.04,
        duration: 0.5,
        ease: 'power2.out',
        filter: `drop-shadow(0 30px 80px ${glowColor}55)`,
      })
      rotationTween.current?.timeScale(4)
      particlesRef.current.forEach((p) => {
        if (!p) return
        gsap.to(p, {
          opacity: 'random(0.25, 0.55)',
          scale: 'random(1.1, 1.5)',
          duration: 0.4,
          overwrite: 'auto',
        })
      })
      gsap.fromTo(
        shimmerRef.current,
        { top: '-10%', opacity: 0.45 },
        { top: '110%', opacity: 0, duration: 0.8, ease: 'power1.inOut' },
      )
    }

    const onLeave = () => {
      gsap.to(glowRef.current, {
        opacity: 0.12,
        scale: 1.0,
        duration: 0.8,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
      gsap.to(glowInnerRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
      })
      gsap.to(imageRef.current, {
        scale: 1.0,
        duration: 0.6,
        ease: 'power2.inOut',
        filter: `drop-shadow(0 20px 60px ${glowColor}33)`,
      })
      rotationTween.current?.timeScale(1)
      particlesRef.current.forEach((p) => {
        if (!p) return
        gsap.to(p, {
          opacity: 'random(0.05, 0.15)',
          scale: 1,
          duration: 0.6,
          overwrite: 'auto',
        })
      })
    }

    container.addEventListener('mouseenter', onEnter)
    container.addEventListener('mouseleave', onLeave)
    return () => {
      container.removeEventListener('mouseenter', onEnter)
      container.removeEventListener('mouseleave', onLeave)
      ctx.revert()
    }
  }, [glowColor])

  const particlePositions: React.CSSProperties[] = [
    { top: '20%', left: '18%' },
    { top: '12%', right: '20%' },
    { bottom: '22%', right: '15%' },
    { bottom: '15%', left: '22%' },
    { top: '50%', left: '8%' },
  ]

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full"
      style={{ height: '100%' }}
    >
      {/* Glow principal — más pequeño y sutil */}
      <div
        ref={glowRef}
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '28%',
          background: `radial-gradient(circle, ${glowColor}40 0%, ${glowColor}00 70%)`,
          opacity: 0.12,
          filter: 'blur(15px)',
          willChange: 'opacity, transform',
        }}
      />

      {/* Glow inner (hover) — más concentrado */}
      <div
        ref={glowInnerRef}
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '38%',
          background: `radial-gradient(circle, ${glowColor}60 0%, ${glowColor}00 70%)`,
          opacity: 0,
          transform: 'scale(0.8)',
          filter: 'blur(10px)',
          willChange: 'opacity, transform',
        }}
      />

      {/* Anillo exterior — más cerca del reloj */}
      <div
        ref={ringRef}
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '20%',
          border: `1px solid ${glowColor}10`,
          backgroundImage: `conic-gradient(${glowColor}20 0deg, transparent 20deg, transparent 40deg, ${glowColor}20 60deg, transparent 80deg, transparent 160deg, ${glowColor}20 180deg, transparent 200deg, transparent 280deg, ${glowColor}20 300deg, transparent 320deg, transparent 360deg)`,
          opacity: 0.4,
          willChange: 'transform',
        }}
      />

      {/* Anillo interior — más adentro */}
      <div
        ref={ring2Ref}
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '30%',
          border: `0.5px solid ${glowColor}14`,
          willChange: 'transform',
        }}
      />

      {/* Shimmer (hover sweep) */}
      <div
        ref={shimmerRef}
        aria-hidden
        className="absolute left-0 right-0 h-[30%] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${glowColor}26, transparent)`,
          opacity: 0,
          top: '-10%',
        }}
      />

      {/* Partículas */}
      {particlePositions.map((pos, i) => (
        <div
          key={i}
          ref={(el) => {
            particlesRef.current[i] = el
          }}
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            ...pos,
            width: i % 2 === 0 ? 3 : 2,
            height: i % 2 === 0 ? 3 : 2,
            background: glowColor,
            opacity: 0.08,
            boxShadow: `0 0 5px ${glowColor}`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Imagen del reloj — fill + object-contain garantiza mismo tamaño
          visible aunque el SVG original cambie de proporción. */}
      <div
        ref={imageRef}
        className="relative z-10 w-full h-full"
        style={{
          filter: `drop-shadow(0 20px 60px ${glowColor}33)`,
          willChange: 'transform, filter',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 360px, 480px"
          className="object-contain"
          priority={modelName === 'NOIR'}
        />
      </div>
    </div>
  )
}
