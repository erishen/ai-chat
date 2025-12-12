import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/components/theme/ThemeProvider'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

// Test component to access theme context
function TestThemeComponent() {
  const { theme, resolvedTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
    </div>
  )
}

describe('Theme System', () => {
  describe('ThemeProvider', () => {
    it('provides default theme', () => {
      render(
        <ThemeProvider>
          <TestThemeComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('theme')).toHaveTextContent('system')
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
    })

    it('provides custom default theme', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <TestThemeComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
    })
  })

  describe('ThemeToggle', () => {
    it('renders theme toggle button', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      )
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('toggles theme on click', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
          <TestThemeComponent />
        </ThemeProvider>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })
  })
})