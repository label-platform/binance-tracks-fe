/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

const customJestConfig = {
    setupFiles: ['<rootDir>/setJestEnv.js'],
    setupFilesAfterEnv: ['<rootDir>/setup-test.ts'],
    moduleNameMapper: {
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@icons/(.*)$': '<rootDir>/src/icons/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^src/(.*)$': '<rootDir>/src/$1',
        'swiper/css/?(pagination)?': '<rootDir>/src/__tests__/mocks/mock-style.ts',
    },
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    snapshotSerializers: ['@emotion/jest/serializer'],
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};

module.exports = createJestConfig(customJestConfig);
