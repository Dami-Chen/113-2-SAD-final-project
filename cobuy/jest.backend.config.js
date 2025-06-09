// jest.backend.config.js
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.env.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  transform: {}
};
