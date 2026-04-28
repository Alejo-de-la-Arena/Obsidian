import { cn } from '@/lib/utils'

type ContainerSize = 'default' | 'copy' | 'copy-wide' | 'full'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: ContainerSize
  as?: React.ElementType
}

const sizes: Record<ContainerSize, string> = {
  default:    'max-w-section mx-auto px-[5vw]',
  copy:       'max-w-copy mx-auto px-[5vw]',
  'copy-wide':'max-w-copy-wide mx-auto px-[5vw]',
  full:       'w-full px-[5vw]',
}

export function Container({
  children,
  className,
  size = 'default',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag className={cn(sizes[size], className)}>
      {children}
    </Tag>
  )
}
