import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Textarea } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'

describe('UI Components', () => {
  describe('Button', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('renders with loading state', () => {
      render(<Button loading>Loading</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('renders with different variants', () => {
      render(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-secondary')
    })
  })

  describe('Card', () => {
    it('renders with children', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('renders with different variants', () => {
      render(<Card variant="outline">Outline card</Card>)
      expect(screen.getByText('Outline card')).toBeInTheDocument()
    })
  })

  describe('Input', () => {
    it('renders input field', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('renders textarea', () => {
      render(<Textarea placeholder="Enter message" />)
      expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument()
    })
  })

  describe('Avatar', () => {
    it('renders avatar container', () => {
      render(<Avatar>A</Avatar>)
      expect(screen.getByText('A')).toBeInTheDocument()
    })
  })
})