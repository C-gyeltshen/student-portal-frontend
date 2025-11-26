const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/__tests__/__mocks__/styleMock.js",
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i":
      "<rootDir>/__tests__/__mocks__/fileMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  // Coverage Collection
  collectCoverage: false, // Enable via --coverage flag
  collectCoverageFrom: [
    // Include all component files
    "src/app/**/*.{js,jsx,ts,tsx}",
    "src/components/**/*.{js,jsx,ts,tsx}",
    "src/lib/**/*.{js,jsx,ts,tsx}",
    "src/utils/**/*.{js,jsx,ts,tsx}",

    // Exclusions
    "!src/**/*.d.ts", // TypeScript declaration files
    "!src/**/*.stories.{js,jsx,ts,tsx}", // Storybook files
    "!src/**/__tests__/**", // Test files
    "!src/**/*.test.{js,jsx,ts,tsx}", // Test files
    "!src/**/*.spec.{js,jsx,ts,tsx}", // Spec files
    "!src/app/layout.tsx", // Next.js layout (usually simple)
    "!src/app/**/layout.tsx", // Nested layouts
  ],

  // Coverage Directory
  coverageDirectory: "<rootDir>/coverage",

  // Coverage Reporters
  coverageReporters: [
    "html", // HTML report for local viewing
    "lcov", // LCOV format for CI tools (Codecov, Coveralls, etc.)
    "text", // Summary in terminal
    "text-summary", // Brief summary in terminal
    "json", // JSON format for programmatic access
  ],

  // Coverage Thresholds
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
    // Per-directory thresholds (optional, can be customized)
    "./src/app/user/finance/**/*.{js,jsx,ts,tsx}": {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },

  // Coverage Path Ignore Patterns
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/coverage/",
    "/dist/",
    "/build/",
    "/__tests__/",
    "/__mocks__/",
    "/public/",
    "/styles/",
    ".config.js",
    ".config.ts",
  ],

  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/__tests__/__mocks__/",
  ],
};

module.exports = createJestConfig(customJestConfig);
