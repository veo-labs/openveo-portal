'use strict';

module.exports = {

  // Use mocha and chai for tests
  frameworks: ['mocha', 'chai'],

  // Web server port
  port: 9876,

  // Disable colors in the output (reporters and logs)
  colors: true,

  // Level of logging
  // Possible values: OFF || ERROR || WARN || INFO || DEBUG
  logLevel: 'INFO',

  // Disable watching files and executing tests whenever any file changes
  autoWatch: false,

  // List of browsers to execute tests on
  browsers: ['ChromeHeadlessCI'],

  // Configure custom ChromHeadlessCI as an extension of ChromeHeadlessCI without sandbox
  customLaunchers: {
    ChromeHeadlessCI: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox']
    }
  },

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: true

};
