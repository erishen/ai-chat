import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline' | 'filled'
  inputSize?: 'sm' | 'md' | 'lg'
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'outline' | 'filled'
  inputSize?: 'sm' | 'md' | 'lg'
}

const inputVariants = {
  default: 'border border-input bg-background focus:ring-ring',
  outline: 'border-2 border-input bg-transparent focus:ring-ring focus:border-ring',
  filled: 'border-0 bg-muted focus:ring-ring focus:bg-background',
}

const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-6 text-lg',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', inputSize = 'md', type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-lg font-medium transition-colors',
          'placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          inputVariants[variant],
          inputSizes[inputSize],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', inputSize = 'md', ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg font-medium transition-colors',
          'placeholder:text-muted-foreground resize-none',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          inputVariants[variant],
          inputSize === 'sm' && 'px-3 py-2 text-sm',
          inputSize === 'md' && 'px-4 py-3',
          inputSize === 'lg' && 'px-6 py-4 text-lg',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'