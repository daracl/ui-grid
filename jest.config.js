module.exports = {
  verbose: true,
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@t/(.*)$": "<rootDir>/src/types/$1",
  },
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "json"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.js$": "babel-jest",
    //"^.+\\.(ts|tsx|js|jsx)$": ["ts-jest", { isolatedModules: true, useESM: true }],
    "^.+\\.(ts|tsx|js|jsx)$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
  },
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["/node_modules/"],
  // globals: {
  //   "ts-jest": {
  //     tsconfig: "tsconfig.json",
  //   },
  // },
};
