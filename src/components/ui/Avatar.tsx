import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'circle' | 'square'
}

const avatarSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

const avatarVariants = {
  circle: 'rounded-full',
  square: 'rounded-lg',
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', variant = 'circle', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden',
          'bg-muted flex items-center justify-center',
          avatarSizes[size],
          avatarVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export const AvatarImage = forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
)

AvatarImage.displayName = 'AvatarImage'

export const AvatarFallback = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center bg-muted text-muted-foreground',
        'text-sm font-medium',
        className
      )}
      {...props}
    />
  )
)

AvatarFallback.displayName = 'AvatarFallback'