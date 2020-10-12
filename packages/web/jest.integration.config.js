const jestConfig = require('./jest.config')

module.exports = {
  ...jestConfig,
  testRegex: '.integration.(ts|js)$',
}
