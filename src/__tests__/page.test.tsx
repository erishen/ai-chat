import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { ThemeProvider } from '@/components/theme'

// Mock the useChat hook
jest.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    setMessages: jest.fn(),
  }),
}))

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('Home Page', () => {
  it('renders the chat interface', () => {
    render(<Home />, { wrapper: TestWrapper })
    
    // Check if the main elements are present
    expect(screen.getByText('开始与 AI 助手对话吧！')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入您的消息... (Shift + Enter 换行)')).toBeInTheDocument()
  })

  it('displays empty state when no messages', () => {
    render(<Home />, { wrapper: TestWrapper })
    
    expect(screen.getByText('开始与 AI 助手对话吧！')).toBeInTheDocument()
    expect(screen.getByText('输入您的问题，我会尽力为您解答。')).toBeInTheDocument()
  })
})