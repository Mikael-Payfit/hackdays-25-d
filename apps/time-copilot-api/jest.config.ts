process.env.NODE_ENV = 'development';
process.env.PORT = '3000';
process.env.ENVIRONMENT = 'local';
process.env.TZ = 'GMT';
process.env.LOG_LEVEL = 'warn';
process.env.ENV = 'custom';
process.env.STS_AUTH_TOKEN_SECRET = 'secret-for-test';
process.env.MODULES_SERVICE_URL = 'http://some-url';
process.env.GRAPHQL_DATA_LAYER_URL = 'http://some-url';
process.env.AWS_DYNAMODB_ENDPOINT = 'http://localhost:9000';
process.env.HRIS_TIME_EXTERNAL_INTERNAL_MAPPING_TABLE =
  'hris-time-external-internal-mapping';
process.env.COMPANY_DIGEST_SNAPSHOT_TABLE_NAME =
  'hris-workschedule-company-digest-snapshot';

// Use dedicated db in CI
if (process.env.CI) {
  process.env.MONGO_TIME_URL = 'mongodb://time-mongo:27017/time-absences-api';
  process.env.AWS_DYNAMODB_ENDPOINT = 'http://time-dynamo:8000';
}

export default {
  displayName: 'time-copilot-api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testMatch: ['<rootDir>/jest-cucumber-setup.ts', '<rootDir>/**/*.spec.ts'],
  coverageDirectory: '../../coverage/apps/time-copilot-api',
};
