import type { Config } from "jest";
const config: Config = { preset: "ts-jest", testEnvironment: "jsdom", testMatch: ["**/*.test.ts", "**/*.test.tsx"], setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" } };
export default config;
