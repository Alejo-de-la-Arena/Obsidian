'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export type ModelLighting = {
  // Color de la luz principal direccional.
  keyColor: string
  // Intensidad de la luz principal.
  keyIntensity: number
  // Intensidad de la luz ambiente.
  ambient: number
  // Color y intensidad de la rim/point light de relleno.
  rimColor: string
  rimIntensity: number
  rimPosition: [number, number, number]
  // Intensidad del environment map (PBR reflections).
  envIntensity?: number
  // Tone mapping exposure.
  exposure?: number
}

type Props = {
  lighting: ModelLighting
  active: boolean
  className?: string
}

/**
 * ModelCanvas — pequeña escena Three.js dedicada a renderizar el reloj
 * con una iluminación específica. Lazy-init: el WebGL context y el GLB
 * sólo se cargan cuando `active` pasa a true por primera vez.
 *
 * Cuando `active === false` el RAF loop se pausa y la GPU descansa.
 */
export function ModelCanvas({ lighting, active, className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [shouldInit, setShouldInit] = useState(false)
  const activeRef = useRef(active)
  activeRef.current = active

  // Lazy: la primera vez que active === true marcamos shouldInit.
  useEffect(() => {
    if (active) setShouldInit(true)
  }, [active])

  useEffect(() => {
    if (!shouldInit) return
    const mount = mountRef.current
    if (!mount) return

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = lighting.exposure ?? 1.0
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(mount.clientWidth || 1, mount.clientHeight || 1, false)

    const canvas = renderer.domElement
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    canvas.style.display = 'block'
    mount.appendChild(canvas)

    const scene = new THREE.Scene()

    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex
    scene.environmentIntensity = lighting.envIntensity ?? 1

    const aspect = (mount.clientWidth || 1) / (mount.clientHeight || 1)
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 100)
    camera.position.set(0, 0.1, 6.5)
    camera.lookAt(0, 0, 0)

    const ambient = new THREE.AmbientLight('#FFFFFF', lighting.ambient)
    scene.add(ambient)

    const key = new THREE.DirectionalLight(lighting.keyColor, lighting.keyIntensity)
    key.position.set(3, 5, 4)
    scene.add(key)

    const rim = new THREE.PointLight(lighting.rimColor, lighting.rimIntensity, 14, 1.5)
    rim.position.set(...lighting.rimPosition)
    scene.add(rim)

    const watchPivot = new THREE.Group()
    const watchSpin = new THREE.Group()
    watchPivot.add(watchSpin)
    scene.add(watchPivot)

    let modelReady = false
    let mouseTargetX = 0
    let mouseTargetY = 0
    const maxRot = 0.18

    const loader = new GLTFLoader()
    loader.load(
      '/models/watch.glb',
      (gltf) => {
        const root = gltf.scene
        const box = new THREE.Box3().setFromObject(root)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        root.position.sub(center)

        const targetSize = 2.4
        const scale = targetSize / (Math.max(size.x, size.y, size.z) || 1)
        root.scale.setScalar(scale)

        watchSpin.add(root)
        modelReady = true
      },
      undefined,
      (err) => console.error('[ModelCanvas] GLTF load failed', err),
    )

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        mouseTargetX = 0
        mouseTargetY = 0
        return
      }
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      mouseTargetY = nx * maxRot
      mouseTargetX = ny * maxRot * 0.6
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const applySize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    applySize()
    const ro = new ResizeObserver(applySize)
    ro.observe(mount)

    const clock = new THREE.Clock()
    let rafId = 0
    const tick = () => {
      rafId = requestAnimationFrame(tick)
      if (!activeRef.current) return
      const t = clock.getElapsedTime()
      if (modelReady) {
        watchPivot.position.y = Math.sin(t * 0.6) * 0.06
        if (!noMotion) {
          watchPivot.rotation.x += (mouseTargetX - watchPivot.rotation.x) * 0.05
          watchPivot.rotation.y += (mouseTargetY - watchPivot.rotation.y) * 0.05
        }
      }
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            if (!m) return
            const any = m as THREE.Material & {
              map?: THREE.Texture | null
              normalMap?: THREE.Texture | null
              roughnessMap?: THREE.Texture | null
              metalnessMap?: THREE.Texture | null
              emissiveMap?: THREE.Texture | null
              aoMap?: THREE.Texture | null
            }
            any.map?.dispose()
            any.normalMap?.dispose()
            any.roughnessMap?.dispose()
            any.metalnessMap?.dispose()
            any.emissiveMap?.dispose()
            any.aoMap?.dispose()
            m.dispose()
          })
        }
      })
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      if (mount.contains(canvas)) mount.removeChild(canvas)
    }
  }, [shouldInit, lighting])

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={className ?? 'absolute inset-0'}
    />
  )
}

export const MODEL_LIGHTING: Record<'NOIR' | 'ALBA' | 'FORGE', ModelLighting> = {
  NOIR: {
    keyColor: '#e8eeff',
    keyIntensity: 1.6,
    ambient: 0.15,
    rimColor: '#ffffff',
    rimIntensity: 2.6,
    rimPosition: [-2, 1.5, -3],
    envIntensity: 0.85,
    exposure: 0.95,
  },
  ALBA: {
    keyColor: '#fff5e6',
    keyIntensity: 1.4,
    ambient: 0.4,
    rimColor: '#ffd089',
    rimIntensity: 2.2,
    rimPosition: [3, 1.5, 2],
    envIntensity: 1.1,
    exposure: 1.15,
  },
  FORGE: {
    keyColor: '#f0f0f0',
    keyIntensity: 1.2,
    ambient: 0.2,
    rimColor: '#4488ff',
    rimIntensity: 1.6,
    rimPosition: [2.5, 0.5, -2.5],
    envIntensity: 0.95,
    exposure: 1.0,
  },
}
