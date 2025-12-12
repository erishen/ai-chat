import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  center?: boolean
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

const containerPadding = {
  none: '',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = 'md', center = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          containerSizes[size],
          containerPadding[padding],
          center && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const flexDirection = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
}

const flexAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const flexJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const flexWrap = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
}

const flexGap = {
  none: '',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction = 'row', 
    align = 'start', 
    justify = 'start', 
    wrap = 'nowrap',
    gap = 'none',
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          flexDirection[direction],
          flexAlign[align],
          flexJustify[justify],
          flexWrap[wrap],
          flexGap[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Flex.displayName = 'Flex'