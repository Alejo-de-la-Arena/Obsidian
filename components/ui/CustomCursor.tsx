'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.style.cursor = 'none'
    document.documentElement.classList.add('custom-cursor-active')

    // Posición inicial fuera de pantalla — evita flash en top-left.
    gsap.set([dot, ring], { x: -100, y: -100, xPercent: -50, yPercent: -50, opacity: 0 })

    const xTo = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })

    let revealed = false

    const onMove = (e: MouseEvent) => {
      if (!revealed) {
        revealed = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.3, ease: 'power2.out' })
      }
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const onEnterButton = () => {
      gsap.to(ring, { scale: 1.8, opacity: 0.4, duration: 0.3, ease: 'power3.out' })
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }
    const onLeaveButton = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' })
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    const onLeaveDoc = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 })
    }
    const onEnterDoc = () => {
      if (revealed) gsap.to([dot, ring], { opacity: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeaveDoc)
    document.addEventListener('mouseenter', onEnterDoc)

    // Hover state — delegación por evento para cubrir elementos
    // que aparecen después (links creados por JSX, modales, etc).
    const matchInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false
      return !!target.closest('a, button, [data-cursor="button"]')
    }

    const onOver = (e: MouseEvent) => {
      if (matchInteractive(e.target)) onEnterButton()
    }
    const onOut = (e: MouseEvent) => {
      if (matchInteractive(e.target) && !matchInteractive(e.relatedTarget)) onLeaveButton()
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeaveDoc)
      document.removeEventListener('mouseenter', onEnterDoc)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.style.cursor = ''
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#00FF88',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(0, 255, 136, 0.7)',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0,
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform, width, height',
        }}
      />
    </>
  )
}
