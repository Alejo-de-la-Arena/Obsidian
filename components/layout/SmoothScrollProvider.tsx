'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { LENIS_OPTIONS } from '@/lib/lenis'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis(LENIS_OPTIONS)
    lenisRef.current = lenis

    // Conectar Lenis con GSAP ScrollTrigger
    // Lenis actualiza la posición de scroll nativa, por lo que
    // ScrollTrigger la lee correctamente. Solo necesitamos
    // notificar a ScrollTrigger en cada tick de Lenis.
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    // Usar el ticker de GSAP como RAF loop — evita doble rAF
    const tickerCallback = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerCallback)

    // lagSmoothing(0) previene que GSAP "salte" animaciones
    // cuando la pestaña estaba inactiva y vuelve a tener foco
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
