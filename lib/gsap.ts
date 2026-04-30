import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

// Registrar plugins y configurar defaults — solo en el cliente
// Los plugins de GSAP leen el DOM, no son seguros en SSR
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip)

  // Performance: limita callbacks de ScrollTrigger durante scroll rápido.
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

  // Defaults globales OBSIDIAN
  gsap.defaults({
    ease: 'expo.out',
    duration: 1,
  })
}

export { gsap, ScrollTrigger, Flip }
