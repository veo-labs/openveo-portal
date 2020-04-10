'use strict';

module.exports = {

  // Common options for all karma targets
  options: {

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
    browsers: [
      'Chrome'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  },

  // Back office unit tests
  // Task ngDp:backOffice should be run before
  backOffice: {
    configFile: 'tests/client/backOfficeKarmaConf.js'
  },

  // Front office unit tests
  // Task ngDp:backOffice should be run before
  frontOffice: {
    configFile: 'tests/client/frontOfficeKarmaConf.js'
  }

};
