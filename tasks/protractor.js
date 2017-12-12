'use strict';

// Launch end to end tests
// For more information about Grunt protractor, have a look at https://www.npmjs.com/package/grunt-protractor-runner
module.exports = {

  // Launch project's end to end tests
  portal: {
    options: {
      configFile: '<%= project.clientTestSourcesPath %>/protractorConf.js',
      debug: false
    }
  }

};
