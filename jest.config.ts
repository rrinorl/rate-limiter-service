export default {
  testMatch: ['**/?(*.)+(spec|test|e2e|int).[tj]s?(x)'],
  collectCoverage: false,
  transform: {
    '.(ts)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  clearMocks: true,
  coverageDirectory: 'reports/coverage',
  coverageReporters: ['text', 'lcov', 'cobertura'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/build/**',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  testEnvironment: 'node',
};
