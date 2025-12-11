import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the useChat hook
jest.mock('ai/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    setMessages: jest.fn(),
  }),
}))

describe('Home Page', () => {
  it('renders the chat interface', () => {
    render(<Home />)
    
    // Check if the main elements are present
    expect(screen.getByText('开始与 AI 助手对话吧！')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入您的消息... (Shift + Enter 换行)')).toBeInTheDocument()
  })

  it('displays empty state when no messages', () => {
    render(<Home />)
    
    expect(screen.getByText('开始与 AI 助手对话吧！')).toBeInTheDocument()
    expect(screen.getByText('输入您的问题，我会尽力为您解答。')).toBeInTheDocument()
  })
})