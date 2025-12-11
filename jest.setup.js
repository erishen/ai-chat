import '@testing-library/jest-dom'

// Mock scrollIntoView
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
})

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

// Add React for createElement
const React = require('react')