module.exports = {
  setupFiles: ['./jest.setup.js'],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "jest-transform-stub"
  }
};
