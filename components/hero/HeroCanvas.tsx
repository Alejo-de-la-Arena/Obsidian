'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { gsap } from '@/lib/gsap'

/**
 * HeroCanvas — escena Three.js unificada.
 *
 *   Fondo (shader full-screen)  →  noise orgánico + tint verde Seiko sutil.
 *   Partículas                  →  ~800 puntos flotando con blending aditivo.
 *   Reloj 3D                    →  GLTF materiales preservados, lado derecho,
 *                                  auto-rotación + floating, SIN parallax cursor.
 *
 * Todo en un único renderer WebGL para minimizar overhead.
 * Pausamos el render loop cuando el hero sale de viewport (IntersectionObserver)
 * y respetamos prefers-reduced-motion.
 */

function debounce<T extends (...args: never[]) => void>(fn: T, wait: number) {
  let t: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

// ─── Shaders del fondo ─────────────────────────────────────────────────
const bgVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`

const bgFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uColorBase;
  uniform vec3  uColorAccent;
  uniform float uIntensity;

  // Simplex-like cheap noise (value noise con smoothstep).
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p  = uv * vec2(uResolution.x / uResolution.y, 1.0);

    // Movimiento lento tipo aurora / niebla.
    float t = uTime * 0.06;
    float n1 = fbm(p * 1.6 + vec2(t, -t * 0.7));
    float n2 = fbm(p * 3.2 - vec2(t * 0.5, t));
    float blend = smoothstep(0.35, 0.85, n1 * 0.6 + n2 * 0.4);

    // Capa de acento verde hacia la derecha del hero (donde está el reloj).
    float rightBias = smoothstep(0.3, 1.0, uv.x);
    float halo = rightBias * (0.25 + 0.35 * blend);

    vec3 color = uColorBase;
    color = mix(color, uColorAccent, halo * uIntensity);

    // Vignette suave.
    float vig = smoothstep(1.2, 0.25, length(uv - 0.5));
    color *= vig * 0.95 + 0.05;

    // Dithering 8-bit para evitar banding.
    float dither = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
    color += dither;

    gl_FragColor = vec4(color, 1.0);
  }
`

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    // ─── Renderer ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
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

    // ─── Cámara ──────────────────────────────────────────────────────
    const aspect = (mount.clientWidth || 1) / (mount.clientHeight || 1)
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100)
    camera.position.set(0, 0.2, isMobile ? 12 : 7.5)
    camera.lookAt(0, 0, 0)

    // ─── Escena ──────────────────────────────────────────────────────
    const scene = new THREE.Scene()

    // Environment HDR procedural — critical para PBR del reloj.
    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    // ─── 1. Fondo shader (full-screen triangle) ──────────────────────
    const bgUniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColorBase:   { value: new THREE.Color('#000000') },
      uColorAccent: { value: new THREE.Color('#00FF88') },
      uIntensity:   { value: 0.32 },
    }
    const bgGeom = new THREE.PlaneGeometry(2, 2)
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: bgVertex,
      fragmentShader: bgFragment,
      uniforms: bgUniforms,
      depthWrite: false,
      depthTest: false,
    })
    const bgQuad = new THREE.Mesh(bgGeom, bgMat)
    bgQuad.frustumCulled = false
    bgQuad.renderOrder = -1
    // En mobile el canvas vive al final del hero como elemento separado
    // y debe ser transparente — el fondo lo da el body de la sección.
    if (!isMobile) scene.add(bgQuad)

    // ─── 2. Partículas (~800 puntos flotantes) ───────────────────────
    const PARTICLE_COUNT = isMobile ? 350 : 800
    const pPos = new Float32Array(PARTICLE_COUNT * 3)
    const pSeed = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3 + 0] = (Math.random() - 0.5) * 14
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
      pSeed[i] = Math.random() * 1000
    }
    const pGeom = new THREE.BufferGeometry()
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeom.setAttribute('aSeed', new THREE.BufferAttribute(pSeed, 1))

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uColor: { value: new THREE.Color('#00FF88') },
        uSize:  { value: isMobile ? 22 : 28 },
      },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.3 + aSeed) * 0.35;
          pos.x += cos(uTime * 0.22 + aSeed * 1.3) * 0.25;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPixelRatio / -mv.z;
          // Alpha según profundidad — los lejanos casi invisibles.
          vAlpha = smoothstep(-8.0, 2.0, mv.z) * 0.55;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    })
    const particles = new THREE.Points(pGeom, pMat)
    if (!isMobile) scene.add(particles)

    // ─── 3. Luces sutiles (complementan el environment map) ──────────
    const ambient = new THREE.AmbientLight('#FFFFFF', 0.7)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight('#FFFFFF', 1.2)
    dirLight.position.set(3, 5, 3)
    scene.add(dirLight)

    // Punto de acento verde — realza los laterales metálicos del reloj.
    const seikoRim = new THREE.PointLight('#00FF88', 1.4, 10, 1.6)
    seikoRim.position.set(4, 1, 2)
    scene.add(seikoRim)

    // ─── 4. Reloj ────────────────────────────────────────────────────
    //    Layout: grupo padre → traslada a la derecha + floating.
    //            grupo interno → rotación idle (y axis).
    const watchPivot = new THREE.Group()
    const watchSpin = new THREE.Group()
    watchPivot.add(watchSpin)
    scene.add(watchPivot)

    // Posición lateral derecha. En mobile lo centramos.
    const rightOffsetX = isMobile ? 0 : 2.0
    watchPivot.position.set(rightOffsetX, 0, 0)
    // Cara del reloj de frente — sin tilt 3/4. El mouse da el sutil
    // parallax (±0.15 rad) sin nunca esconder la esfera.
    watchPivot.rotation.set(0, 0, 0)

    let modelReady = false
    let loader: GLTFLoader | null = new GLTFLoader()

    loader.load(
      '/models/watch.glb',
      (gltf) => {
        const root = gltf.scene

        const box = new THREE.Box3().setFromObject(root)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        root.position.sub(center)

        const targetSize = 2.4
        const currentMax = Math.max(size.x, size.y, size.z) || 1
        const scale = targetSize / currentMax
        root.scale.setScalar(scale)

        // Mejoramos levemente el entorno para resaltar metales.
        root.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = false
            obj.receiveShadow = false
            obj.frustumCulled = true
          }
        })

        watchSpin.add(root)
        modelReady = true

        // Entrada — solo translate-in lateral + fade del canvas. NUNCA
        // rotamos en la entrada porque tapa la cara del reloj.
        if (!noMotion) {
          gsap.from(watchPivot.position, {
            x: rightOffsetX + 3,
            duration: 1.8,
            ease: 'expo.out',
          })
          gsap.from(canvas, {
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
          })
        }
      },
      undefined,
      (err) => {
        console.error('[HeroCanvas] GLTF load failed:', err)
      },
    )

    // ─── Mouse parallax — único motor de rotación del reloj ─────────
    // Rango ±0.15 rad (~8.5°). El reloj nunca gira lo suficiente como
    // para mostrar el costado o la correa.
    const maxRot = 0.15
    let targetRotX = 0
    let targetRotY = 0
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1 // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      targetRotY = nx * maxRot
      targetRotX = ny * maxRot * 0.6
    }
    if (!isMobile) window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ─── Resize ──────────────────────────────────────────────────────
    const applySize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      bgUniforms.uResolution.value.set(w, h)
      pMat.uniforms.uPixelRatio.value = renderer.getPixelRatio()
    }
    applySize()

    const debouncedResize = debounce(applySize, 150)
    const resizeObserver = new ResizeObserver(() => debouncedResize())
    resizeObserver.observe(mount)
    window.addEventListener('resize', debouncedResize)

    // ─── Visibility / intersection → pausamos RAF fuera de viewport ──
    let visible = true
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0 },
    )
    io.observe(mount)

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ─── Render loop ─────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let rafId = 0

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      if (!visible) return

      const dt = clock.getDelta()
      const t = clock.getElapsedTime()

      bgUniforms.uTime.value = t
      pMat.uniforms.uTime.value = t

      if (modelReady) {
        if (!noMotion) {
          // Floating vertical suave (respiración).
          watchPivot.position.y = Math.sin(t * 0.6) * 0.08
          // Lerp hacia el target del mouse — la cara siempre visible.
          watchPivot.rotation.x += (targetRotX - watchPivot.rotation.x) * 0.05
          watchPivot.rotation.y += (targetRotY - watchPivot.rotation.y) * 0.05
        }
      }

      renderer.render(scene, camera)
    }
    tick()

    // ─── Cleanup ─────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      io.disconnect()
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            if (!m) return
            const anyMat = m as THREE.Material & {
              map?: THREE.Texture | null
              normalMap?: THREE.Texture | null
              roughnessMap?: THREE.Texture | null
              metalnessMap?: THREE.Texture | null
              emissiveMap?: THREE.Texture | null
              aoMap?: THREE.Texture | null
            }
            anyMat.map?.dispose()
            anyMat.normalMap?.dispose()
            anyMat.roughnessMap?.dispose()
            anyMat.metalnessMap?.dispose()
            anyMat.emissiveMap?.dispose()
            anyMat.aoMap?.dispose()
            m.dispose()
          })
        }
      })
      bgGeom.dispose()
      bgMat.dispose()
      pGeom.dispose()
      pMat.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      loader = null

      if (mount.contains(canvas)) mount.removeChild(canvas)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="relative w-full h-[340px] md:absolute md:inset-0 md:h-full order-last md:order-none"
      style={{ zIndex: 1 }}
    />
  )
}
