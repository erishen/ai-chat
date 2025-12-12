import { render, screen } from '@testing-library/react'
import { Container, Flex } from '@/components/layout/Container'
import { Stack, Grid } from '@/components/layout/Stack'

describe('Layout Components', () => {
  describe('Container', () => {
    it('renders with children', () => {
      render(<Container>Container content</Container>)
      expect(screen.getByText('Container content')).toBeInTheDocument()
    })

    it('applies size classes correctly', () => {
      const { container } = render(<Container size="sm">Small container</Container>)
      expect(container.firstChild).toHaveClass('max-w-2xl')
    })
  })

  describe('Flex', () => {
    it('renders with flex layout', () => {
      const { container } = render(<Flex>Flex content</Flex>)
      expect(container.firstChild).toHaveClass('flex')
    })

    it('applies direction classes', () => {
      const { container } = render(<Flex direction="col">Column flex</Flex>)
      expect(container.firstChild).toHaveClass('flex-col')
    })
  })

  describe('Stack', () => {
    it('renders with stack layout', () => {
      const { container } = render(<Stack>Stack content</Stack>)
      expect(container.firstChild).toHaveClass('flex')
    })

    it('applies spacing classes', () => {
      const { container } = render(<Stack spacing="lg">Large spacing</Stack>)
      expect(container.firstChild).toHaveClass('gap-6')
    })
  })

  describe('Grid', () => {
    it('renders with grid layout', () => {
      const { container } = render(<Grid>Grid content</Grid>)
      expect(container.firstChild).toHaveClass('grid')
    })

    it('applies column classes', () => {
      const { container } = render(<Grid cols={3}>Three columns</Grid>)
      expect(container.firstChild).toHaveClass('grid-cols-3')
    })
  })
})