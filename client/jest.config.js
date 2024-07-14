module.exports = {
  // Other configurations...
  testEnvironment: "jsdom",
  setupFiles: ['./jest.setup.js'],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "jest-transform-stub"
  },
  globals: {
    'process.env.NODE_ENV': 'test',
    'process.env.FIRESTORE_EMULATOR_HOST': 'localhost:8080',
  },
};
