export default {
  preset: "ts-jest", // Use ts-jest preset for TypeScript support
  testEnvironment: "node", // Sets the test environment to Node.js
  testMatch: ["**/?(*.)+(spec|test).ts"], // Matches test files ending with .test.ts or .spec.ts
  moduleFileExtensions: ["ts", "js"], // Recognizes both TypeScript and JavaScript files
  transform: {
    "^.+\\.ts$": "ts-jest", // Transforms .ts files using ts-jest
  },
  collectCoverage: true, // Collects test coverage information
  coverageDirectory: "coverage", // Outputs coverage results to the 'coverage' folder
  coverageProvider: "v8", // Uses the V8 JavaScript engine to collect coverage
};
