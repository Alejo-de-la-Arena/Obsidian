import type Lenis from '@studio-freight/lenis'

// Configuración de Lenis para OBSIDIAN
// Easing: cubic que replica expo.out — coherente con los easings GSAP del proyecto
export const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number): number => 1 - Math.pow(1 - t, 3),
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
} as const

export type LenisInstance = InstanceType<typeof Lenis>
