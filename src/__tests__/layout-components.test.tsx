import { render, screen } from '@testing-library/react'
import { Container, Flex } from '@/components/layout/Container'
import { Stack, Grid } from '@/components/layout/Stack'

describe('Layout Components with CVA', () => {
  describe('Container', () => {
    it('renders with children', () => {
      render(<Container>Container content</Container>)
      expect(screen.getByText('Container content')).toBeInTheDocument()
    })

    it('applies size classes correctly using CVA', () => {
      const { container } = render(<Container size="sm">Small container</Container>)
      expect(container.firstChild).toHaveClass('max-w-2xl')
      expect(container.firstChild).toHaveClass('w-full')
    })

    it('applies padding classes using CVA', () => {
      const { container } = render(<Container padding="lg">Large padding</Container>)
      expect(container.firstChild).toHaveClass('px-8')
    })

    it('applies center classes using CVA', () => {
      const { container } = render(<Container center={true}>Centered</Container>)
      expect(container.firstChild).toHaveClass('mx-auto')
    })

    it('does not center when center is false', () => {
      const { container } = render(<Container center={false}>Not centered</Container>)
      expect(container.firstChild).not.toHaveClass('mx-auto')
    })

    it('applies full size correctly', () => {
      const { container } = render(<Container size="full">Full width</Container>)
      expect(container.firstChild).toHaveClass('max-w-full')
    })
  })

  describe('Flex', () => {
    it('renders with flex layout using CVA', () => {
      const { container } = render(<Flex>Flex content</Flex>)
      expect(container.firstChild).toHaveClass('flex')
    })

    it('applies direction classes using CVA', () => {
      const { container } = render(<Flex direction="col">Column flex</Flex>)
      expect(container.firstChild).toHaveClass('flex-col')
    })

    it('applies alignment classes using CVA', () => {
      const { container } = render(<Flex align="center">Centered flex</Flex>)
      expect(container.firstChild).toHaveClass('items-center')
    })

    it('applies justify classes using CVA', () => {
      const { container } = render(<Flex justify="between">Space between</Flex>)
      expect(container.firstChild).toHaveClass('justify-between')
    })

    it('applies wrap classes using CVA', () => {
      const { container } = render(<Flex wrap="wrap">Wrapped flex</Flex>)
      expect(container.firstChild).toHaveClass('flex-wrap')
    })

    it('applies gap classes using CVA', () => {
      const { container } = render(<Flex gap="lg">Large gap</Flex>)
      expect(container.firstChild).toHaveClass('gap-6')
    })

    it('applies reverse direction correctly', () => {
      const { container } = render(<Flex direction="row-reverse">Reverse row</Flex>)
      expect(container.firstChild).toHaveClass('flex-row-reverse')
    })
  })

  describe('Stack', () => {
    it('renders with stack layout using CVA', () => {
      const { container } = render(<Stack>Stack content</Stack>)
      expect(container.firstChild).toHaveClass('flex')
      expect(container.firstChild).toHaveClass('flex-col') // Default direction
    })

    it('applies spacing classes using CVA', () => {
      const { container } = render(<Stack spacing="lg">Large spacing</Stack>)
      expect(container.firstChild).toHaveClass('gap-6')
    })

    it('applies horizontal direction', () => {
      const { container } = render(<Stack direction="horizontal">Horizontal stack</Stack>)
      expect(container.firstChild).toHaveClass('flex-row')
    })

    it('applies alignment classes using CVA', () => {
      const { container } = render(<Stack align="center">Centered stack</Stack>)
      expect(container.firstChild).toHaveClass('items-center')
    })

    it('applies justify classes using CVA', () => {
      const { container } = render(<Stack justify="between">Space between stack</Stack>)
      expect(container.firstChild).toHaveClass('justify-between')
    })

    it('applies extra small spacing', () => {
      const { container } = render(<Stack spacing="xs">XS spacing</Stack>)
      expect(container.firstChild).toHaveClass('gap-1')
    })
  })

  describe('Grid', () => {
    it('renders with grid layout using CVA', () => {
      const { container } = render(<Grid>Grid content</Grid>)
      expect(container.firstChild).toHaveClass('grid')
    })

    it('applies column classes using CVA', () => {
      const { container } = render(<Grid cols={3}>Three columns</Grid>)
      expect(container.firstChild).toHaveClass('grid-cols-3')
    })

    it('applies gap classes using CVA', () => {
      const { container } = render(<Grid gap="lg">Large gap grid</Grid>)
      expect(container.firstChild).toHaveClass('gap-6')
    })

    it('handles responsive grid correctly', () => {
      const { container } = render(<Grid cols={4} responsive={true}>Responsive grid</Grid>)
      // Should have responsive classes
      expect(container.firstChild).toHaveClass('grid-cols-1')
    })

    it('applies 12 column grid', () => {
      const { container } = render(<Grid cols={12}>Twelve columns</Grid>)
      expect(container.firstChild).toHaveClass('grid-cols-12')
    })

    it('applies no gap when specified', () => {
      const { container } = render(<Grid gap="none">No gap grid</Grid>)
      expect(container.firstChild).not.toHaveClass('gap-1')
      expect(container.firstChild).not.toHaveClass('gap-2')
      expect(container.firstChild).not.toHaveClass('gap-4')
    })
  })

  describe('CVA Integration for Layout', () => {
    it('combines multiple CVA variants correctly in Container', () => {
      const { container } = render(
        <Container size="lg" padding="sm" center={true}>
          Combined Container
        </Container>
      )
      const element = container.firstChild
      expect(element).toHaveClass('max-w-6xl')
      expect(element).toHaveClass('px-4')
      expect(element).toHaveClass('mx-auto')
    })

    it('combines multiple CVA variants correctly in Flex', () => {
      const { container } = render(
        <Flex direction="col" align="center" justify="between" gap="md">
          Combined Flex
        </Flex>
      )
      const element = container.firstChild
      expect(element).toHaveClass('flex-col')
      expect(element).toHaveClass('items-center')
      expect(element).toHaveClass('justify-between')
      expect(element).toHaveClass('gap-4')
    })

    it('applies custom className alongside CVA classes', () => {
      const { container } = render(
        <Stack spacing="lg" className="custom-stack">
          Custom Stack
        </Stack>
      )
      const element = container.firstChild
      expect(element).toHaveClass('custom-stack')
      expect(element).toHaveClass('gap-6')
    })
  })
})