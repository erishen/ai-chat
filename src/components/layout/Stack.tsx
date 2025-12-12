import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal'
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
}

const stackDirection = {
  vertical: 'flex-col',
  horizontal: 'flex-row',
}

const stackSpacing = {
  none: '',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const stackAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const stackJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ 
    className, 
    direction = 'vertical', 
    spacing = 'md', 
    align = 'stretch',
    justify = 'start',
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          stackDirection[direction],
          stackSpacing[spacing],
          stackAlign[align],
          stackJustify[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Stack.displayName = 'Stack'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
}

const gridGap = {
  none: '',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    cols = 1, 
    gap = 'md',
    responsive = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          responsive ? `grid-cols-1 md:${gridCols[cols]}` : gridCols[cols],
          gridGap[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'