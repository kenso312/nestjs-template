module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@entity/(.*)$': '<rootDir>/src/database/entities/$1',
    '^@migrate/(.*)$': '<rootDir>/src/database/migrations/$1',
    '^@repo/(.*)$': '<rootDir>/src/database/repositories/$1',
    '^@sub/(.*)$': '<rootDir>/src/database/subscribers/$1',
    '^@share/(.*)$': '<rootDir>/shared/$1',
  },
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
