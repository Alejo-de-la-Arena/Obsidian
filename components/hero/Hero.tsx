'use client'

import { HeroCanvas } from './HeroCanvas'
import { HeroContent } from './HeroContent'
import { HeroFrame } from './HeroFrame'

/**
 * Hero — stack de 4 capas:
 *   z-1 : HeroCanvas (fondo shader + partículas + reloj)
 *   z-2 : Overlay de gradiente (asegura legibilidad del texto a la izquierda)
 *   z-3 : HeroFrame (marcas decorativas · crosshair · coords · status)
 *   z-4 : HeroContent (texto + CTAs)
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-noise block"
      style={{
        height: '100svh',
        minHeight: 600,
        backgroundColor: '#08090B',
      }}
      aria-label="Hero OBSIDIAN"
    >
      <HeroCanvas />

      {/* Overlay desktop — degradado horizontal para legibilidad del texto a la izquierda */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(90deg, rgba(8,9,11,0.92) 0%, rgba(8,9,11,0.55) 35%, rgba(8,9,11,0) 60%, rgba(8,9,11,0.35) 100%)',
        }}
      />

      {/* Overlay mobile — velo que oscurece el reloj de fondo para mantener legibilidad
          de los textos. Doble gradiente: oscurece arriba y abajo, deja un halo central
          alrededor del reloj. */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(180deg, rgba(8,9,11,0.92) 0%, rgba(8,9,11,0.6) 30%, rgba(8,9,11,0.55) 65%, rgba(8,9,11,0.92) 100%)',
        }}
      />

      {/* Soft vignette bottom para la zona de la meta — desktop only */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none hidden md:block"
        style={{
          zIndex: 2,
          background: 'linear-gradient(to top, rgba(8,9,11,0.85), rgba(8,9,11,0))',
        }}
      />

      <HeroFrame />
      <HeroContent />
    </section>
  )
}
