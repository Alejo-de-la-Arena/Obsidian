import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mapea un valor de un rango a otro — útil para animaciones de scroll
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// Clamp un valor entre min y max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Lerp lineal — para suavizar rotaciones y posiciones en Three.js
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}
