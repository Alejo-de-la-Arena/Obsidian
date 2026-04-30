import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Cache global de GLB. Carga cada URL una sola vez y devuelve clones
 * (`scene.clone(true)`) para que cada consumidor tenga su propio grafo
 * y materiales mutables sin pisarse con otros canvases.
 *
 * Comparte el GLTFLoader para reutilizar parsers y headers.
 */
const sharedLoader = new GLTFLoader()
const cache = new Map<string, Promise<THREE.Group>>()

export async function loadGltf(url: string): Promise<THREE.Group> {
  let entry = cache.get(url)
  if (!entry) {
    entry = new Promise<THREE.Group>((resolve, reject) => {
      sharedLoader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        (err) => reject(err),
      )
    })
    cache.set(url, entry)
  }
  const original = await entry
  return original.clone(true)
}
