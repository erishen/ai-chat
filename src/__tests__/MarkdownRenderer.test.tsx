import { render, screen } from '@testing-library/react'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('renders markdown content container', () => {
    const content = '# Hello World\n\nThis is a **bold** text.'
    render(<MarkdownRenderer content={content} />)
    
    // Check if the markdown container is rendered
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument()
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('Hello World')
  })

  it('renders code blocks', () => {
    const content = '```javascript\nconst hello = "world";\n```'
    render(<MarkdownRenderer content={content} />)
    
    // Check if markdown container is rendered with code content
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument()
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('const hello = "world";')
  })

  it('renders inline code content', () => {
    const content = 'This is `inline code` example.'
    render(<MarkdownRenderer content={content} />)
    
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument()
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('inline code')
  })

  it('renders list content', () => {
    const content = '- Item 1\n- Item 2\n- Item 3'
    render(<MarkdownRenderer content={content} />)
    
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument()
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('Item 1')
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('Item 2')
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('Item 3')
  })
})