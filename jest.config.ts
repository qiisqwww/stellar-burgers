import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  collectCoverage: true, // включить сбор покрытия
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}' // исключить файлы-реэкспорты
  ],
  coverageDirectory: '<rootDir>/coverage', // куда складывать отчёты
  coverageReporters: ['html', 'text', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/']
};

export default config;
