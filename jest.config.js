const { installedCoreSource } = require('./scripts/link-core.cjs');
const core = installedCoreSource();

module.exports = {
  verbose: true,
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",
  moduleNameMapper: {
    ...(core ? { '^@daracl/core/utils$': core.entry } : {}),
    "^@/export/pdf/PdfFontUrl$": "<rootDir>/test/__mocks__/pdfFontUrlMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@t/(.*)$": "<rootDir>/src/types/$1",
  },
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "json"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.js$": "babel-jest",
    //"^.+\\.(ts|tsx|js|jsx)$": ["ts-jest", { isolatedModules: true, useESM: true }],
    "^.+\\.(ts|tsx|js|jsx)$": [
      "ts-jest",
      { tsconfig: "./tsconfig.json", diagnostics: { exclude: ["**/src/export/pdf/PdfFontUrl.ts"] } },
    ],
  },
  testPathIgnorePatterns: ["/node_modules/"],
  modulePathIgnorePatterns: ["<rootDir>/.tmp/"],
  transformIgnorePatterns: ["/node_modules/(?!@daracl/core/)"],
  // globals: {
  //   "ts-jest": {
  //     tsconfig: "tsconfig.json",
  //   },
  // },
};
