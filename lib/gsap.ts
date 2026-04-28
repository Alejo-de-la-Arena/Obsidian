import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

// Registrar plugins y configurar defaults — solo en el cliente
// Los plugins de GSAP leen el DOM, no son seguros en SSR
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip)

  // Defaults globales OBSIDIAN — expo.out para entradas lentas y cinematográficas
  gsap.defaults({
    ease: 'expo.out',
    duration: 1,
  })
}

export { gsap, ScrollTrigger, Flip }
