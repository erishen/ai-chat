import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  children: React.ReactNode
}

const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring',
  ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-ring',
  destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
}

const buttonSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-8 text-lg',
  icon: 'h-10 w-10',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'