module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@entity/(.*)$': '<rootDir>/database/entities/$1',
    '^@migrate/(.*)$': '<rootDir>/database/migrations/$1',
    '^@repo/(.*)$': '<rootDir>/database/repositories/$1',
    '^@sub/(.*)$': '<rootDir>/database/subscribers/$1',
    '^@share/(.*)$': '<rootDir>/shared/$1',
  },
};
