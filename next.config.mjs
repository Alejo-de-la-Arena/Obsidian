/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@studio-freight/lenis', 'three'],
  webpack: (config) => {
    // Prevents canvas native binding errors from Three.js in SSR
    config.externals = [...(config.externals ?? []), { canvas: 'canvas' }]
    return config
  },
}

export default nextConfig
