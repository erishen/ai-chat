import '@testing-library/jest-dom'

// Mock scrollIntoView
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Add React for createElement
const React = require('react')

// Mock react-markdown and related packages
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }) {
    return React.createElement('div', { 'data-testid': 'markdown-content' }, children)
  }
})

jest.mock('react-syntax-highlighter', () => ({
  Prism: function MockPrism({ children }) {
    return React.createElement('pre', { 'data-testid': 'code-block' }, children)
  }
}))

jest.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  oneDark: {}
}))

jest.mock('remark-gfm', () => () => {})
jest.mock('rehype-raw', () => () => {})
jest.mock('rehype-highlight', () => () => {})