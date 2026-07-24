/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  setupFiles: ["<rootDir>/test/env.setup.ts"],
  globalSetup: "<rootDir>/test/globalSetup.js",
  globalTeardown: "<rootDir>/test/globalTeardown.js",
  testMatch: ["**/test/**/*.test.ts"],
  testTimeout: 30000,
};
