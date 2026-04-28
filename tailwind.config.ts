import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Paleta OBSIDIAN ───────────────────────────────────────────
      colors: {
        obsidian: {
          black: '#000000',
          deep:  '#080808',
          warm:  '#0A0F0A',
        },
        bone: {
          DEFAULT: '#F0F7F0',
          pale:    '#F5FAF5',
        },
        // Acento verde brillante (reemplaza el sistema dorado/seiko)
        seiko: {
          DEFAULT: '#00FF88',
          dark:    '#00CC6A',
          deep:    '#00994F',
          light:   '#00E5A0',
        },
        gold: {
          matte: '#00FF88',
          dark:  '#00CC6A',
          light: '#00E5A0',
        },
      },

      // ─── Tipografía ───────────────────────────────────────────────
      fontFamily: {
        // `serif` ahora apunta a Space Grotesk para no tocar todos los
        // className="font-serif" existentes — la identidad cambió a
        // futurista/moderna pero el sistema de clases se mantiene.
        serif: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        sans:  ['var(--font-space-grotesk)', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-jetbrains-mono)', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },

      // ─── Escala tipográfica fluid (320px → 1440px) ───────────────
      fontSize: {
        'display':     ['clamp(5rem, 4.286rem + 3.571vw, 7.5rem)',      { lineHeight: '1.05' }],
        'hero':        ['clamp(3.5rem, 3.071rem + 2.143vw, 5rem)',      { lineHeight: '1.05' }],
        'section':     ['clamp(2.5rem, 2.214rem + 1.429vw, 3.5rem)',   { lineHeight: '1.10' }],
        'model-name':  ['clamp(2rem, 1.714rem + 1.429vw, 3rem)',        { lineHeight: '1.10' }],
        'body-large':  ['clamp(1.25rem, 1.179rem + 0.357vw, 1.5rem)',  { lineHeight: '1.70' }],
        'body':        ['clamp(1rem, 0.964rem + 0.179vw, 1.125rem)',   { lineHeight: '1.60' }],
        'specs':       ['clamp(0.8125rem, 0.795rem + 0.089vw, 0.875rem)', { lineHeight: '1.50' }],
        'label':       ['clamp(0.6875rem, 0.670rem + 0.089vw, 0.75rem)',  {
          lineHeight: '1.20',
          letterSpacing: '0.12em',
        }],
      },

      // ─── Espaciado ────────────────────────────────────────────────
      spacing: {
        'section':        '120px',
        'section-mobile': '80px',
      },

      // ─── Border radius ────────────────────────────────────────────
      borderRadius: {
        'none': '0px',
        'xs':   '2px',
        'sm':   '4px',
        DEFAULT: '2px',
      },

      // ─── Letter spacing ───────────────────────────────────────────
      letterSpacing: {
        tight:   '-0.01em',
        normal:  '0em',
        wide:    '0.05em',
        wider:   '0.12em',
        widest:  '0.20em',
      },

      // ─── Max widths ───────────────────────────────────────────────
      maxWidth: {
        'copy':       '680px',
        'copy-wide':  '720px',
        'section':    '1280px',
      },

      // ─── Transiciones ─────────────────────────────────────────────
      transitionTimingFunction: {
        'obsidian':    'cubic-bezier(0.16, 1, 0.3, 1)',
        'obsidian-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },

      transitionDuration: {
        '100':  '100ms',
        '200':  '200ms',
        '300':  '300ms',
        '600':  '600ms',
        '1200': '1200ms',
        '1400': '1400ms',
      },

      // ─── Animaciones CSS ──────────────────────────────────────────
      animation: {
        'count-up': 'countUp 1.5s cubic-bezier(0.33, 1, 0.68, 1) forwards',
        'fade-in':  'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },

      keyframes: {
        countUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },

      // ─── Z-index ──────────────────────────────────────────────────
      zIndex: {
        'canvas':  '10',
        'content': '20',
        'nav':     '100',
        'modal':   '200',
      },
    },
  },
  plugins: [],
}

export default config
