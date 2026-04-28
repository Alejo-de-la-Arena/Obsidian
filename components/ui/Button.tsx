'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  variant?: ButtonVariant
  className?: string
  children: React.ReactNode
  disabled?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  'aria-label'?: string
}

const base =
  'inline-flex items-center justify-center select-none outline-none ' +
  'font-sans text-label font-medium tracking-wider uppercase ' +
  'transition-colors duration-200 ease-obsidian rounded-xs'

const variants: Record<ButtonVariant, string> = {
  primary: [
    'bg-gold-matte text-obsidian-black px-8 py-4',
    'hover:bg-gold-light',
    'active:bg-gold-dark',
    'disabled:bg-obsidian-warm disabled:text-obsidian-warm/40 disabled:pointer-events-none',
    'focus-visible:outline focus-visible:outline-1',
    'focus-visible:outline-gold-matte focus-visible:outline-offset-[3px]',
  ].join(' '),

  secondary: [
    'bg-transparent text-bone border border-bone px-8 py-4',
    'hover:bg-bone/[0.08]',
    'active:bg-bone/[0.15]',
    'disabled:border-obsidian-warm disabled:text-obsidian-warm disabled:pointer-events-none',
    'focus-visible:outline focus-visible:outline-1',
    'focus-visible:outline-bone focus-visible:outline-offset-[3px]',
  ].join(' '),

  ghost: [
    'bg-transparent text-gold-matte border-none p-0',
    'hover:text-gold-light',
    'active:text-gold-dark',
    'disabled:text-obsidian-warm disabled:pointer-events-none',
    'focus-visible:outline focus-visible:outline-1',
    'focus-visible:outline-gold-matte focus-visible:outline-offset-[3px]',
  ].join(' '),
}

export function Button({
  variant = 'primary',
  className,
  children,
  disabled = false,
  href,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = cn(base, variants[variant], className)

  if (href) {
    return (
      <Link
        href={href}
        className={cn(classes, disabled && 'pointer-events-none opacity-40')}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
