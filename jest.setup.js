import '@testing-library/jest-dom'

// Mock scrollIntoView
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
})