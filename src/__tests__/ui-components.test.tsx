import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Textarea } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'

describe('UI Components with CVA', () => {
  describe('Button', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('renders with loading state', () => {
      render(<Button loading>Loading</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50')
    })

    it('renders with different variants using CVA', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
      expect(button).toHaveClass('text-secondary-foreground')
    })

    it('renders with different sizes using CVA', () => {
      render(<Button size="lg">Large Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-12')
      expect(button).toHaveClass('px-8')
    })

    it('renders outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('border-input')
    })

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('renders icon size correctly', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('w-10')
    })
  })

  describe('Card', () => {
    it('renders with children', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('renders with different variants using CVA', () => {
      const { container } = render(<Card variant="outline">Outline card</Card>)
      expect(container.firstChild).toHaveClass('border-2')
      expect(container.firstChild).toHaveClass('border-border')
    })

    it('renders with different padding using CVA', () => {
      const { container } = render(<Card padding="lg">Large padding</Card>)
      expect(container.firstChild).toHaveClass('p-8')
    })

    it('renders elevated variant correctly', () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>)
      expect(container.firstChild).toHaveClass('shadow-lg')
    })

    it('renders with no padding', () => {
      const { container } = render(<Card padding="none">No padding</Card>)
      expect(container.firstChild).not.toHaveClass('p-4')
      expect(container.firstChild).not.toHaveClass('p-6')
      expect(container.firstChild).not.toHaveClass('p-8')
    })
  })

  describe('Input', () => {
    it('renders input field', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('renders with different variants using CVA', () => {
      render(<Input variant="filled" placeholder="Filled input" />)
      const input = screen.getByPlaceholderText('Filled input')
      expect(input).toHaveClass('border-0')
      expect(input).toHaveClass('bg-muted')
    })

    it('renders with different sizes using CVA', () => {
      render(<Input inputSize="lg" placeholder="Large input" />)
      const input = screen.getByPlaceholderText('Large input')
      expect(input).toHaveClass('h-12')
      expect(input).toHaveClass('px-6')
    })

    it('renders textarea with CVA variants', () => {
      render(<Textarea variant="outline" placeholder="Outline textarea" />)
      const textarea = screen.getByPlaceholderText('Outline textarea')
      expect(textarea).toHaveClass('border-2')
      expect(textarea).toHaveClass('border-input')
    })

    it('handles user input correctly', async () => {
      const user = userEvent.setup()
      render(<Input placeholder="Type here" />)
      
      const input = screen.getByPlaceholderText('Type here')
      await user.type(input, 'Hello World')
      
      expect(input).toHaveValue('Hello World')
    })
  })

  describe('Avatar', () => {
    it('renders avatar container with CVA', () => {
      render(<Avatar>A</Avatar>)
      expect(screen.getByText('A')).toBeInTheDocument()
    })

    it('renders with different sizes using CVA', () => {
      const { container } = render(<Avatar size="lg">L</Avatar>)
      expect(container.firstChild).toHaveClass('h-12')
      expect(container.firstChild).toHaveClass('w-12')
    })

    it('renders with different variants using CVA', () => {
      const { container } = render(<Avatar variant="square">S</Avatar>)
      expect(container.firstChild).toHaveClass('rounded-lg')
    })

    it('renders circle variant by default', () => {
      const { container } = render(<Avatar>C</Avatar>)
      expect(container.firstChild).toHaveClass('rounded-full')
    })

    it('renders extra large size correctly', () => {
      const { container } = render(<Avatar size="xl">XL</Avatar>)
      expect(container.firstChild).toHaveClass('h-16')
      expect(container.firstChild).toHaveClass('w-16')
    })
  })

  describe('CVA Integration', () => {
    it('applies custom className alongside CVA classes', () => {
      const { container } = render(
        <Button variant="primary" className="custom-class">
          Custom Button
        </Button>
      )
      const button = container.firstChild
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('bg-primary')
    })

    it('handles undefined variant gracefully', () => {
      render(<Button variant={undefined}>Undefined Variant</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary') // Should use default
    })

    it('combines multiple CVA variants correctly', () => {
      render(
        <Button variant="outline" size="lg">
          Combined Variants
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('h-12')
    })
  })
})