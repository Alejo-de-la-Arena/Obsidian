import Link from 'next/link'

const LINKS = [
  { href: '#modelos', label: 'Modelos' },
  { href: '#proceso', label: 'El proceso' },
  { href: '#contacto', label: 'Contacto' },
]

export function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: '#080808',
        borderTop: '1px solid rgba(0, 255, 136, 0.1)',
        padding: '48px 0',
      }}
    >
      <div
        className="mx-auto w-full flex flex-col md:grid md:grid-cols-3 items-center gap-8 md:gap-6"
        style={{
          maxWidth: 1200,
          paddingLeft: 'clamp(24px, 6vw, 48px)',
          paddingRight: 'clamp(24px, 6vw, 48px)',
        }}
      >
        {/* Izquierda */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span
            className="font-serif italic"
            style={{ fontSize: 22, color: '#00FF88', fontWeight: 700 }}
          >
            OBSIDIAN
          </span>
          <span
            className="font-sans mt-1"
            style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'rgba(240, 247, 240, 0.4)',
            }}
          >
            Buenos Aires, Argentina · MMXXVI
          </span>
        </div>

        {/* Centro — links */}
        <nav className="flex items-center justify-center gap-6 md:gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="button"
              className="font-sans relative footer-link transition-opacity duration-200"
              style={{
                fontSize: 12,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#F0F7F0',
                opacity: 0.5,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Derecha */}
        <p
          className="font-sans text-center md:text-right"
          style={{
            fontSize: 11,
            color: 'rgba(240, 247, 240, 0.3)',
            letterSpacing: '0.05em',
          }}
        >
          © 2026 OBSIDIAN. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
