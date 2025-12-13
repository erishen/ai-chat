const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-gfm|rehype-highlight|rehype-raw|react-syntax-highlighter)/)',
  ],
  // Memory and performance optimizations
  testTimeout: 10000,
  maxWorkers: 1,
  forceExit: true,
  silent: false,
  collectCoverage: false,
  // Memory management
  logHeapUsage: true,
  detectOpenHandles: true,
  // Limit memory usage
  workerIdleMemoryLimit: '512MB',
  // Clear cache between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)