'use strict';

// Eslint validation
// For more information about Grunt ESLint, have a look at https://www.npmjs.com/package/grunt-eslint
module.exports = {

  // Validate the whole project
  validate: {
    src: [
      'server.js',
      'install.js',
      'Gruntfile.js',
      'processRequire.js',
      'tasks/**/*.js',
      'tests/**/*.js',
      'app/**/*.js',
      'scripts/**/*.js',
      'assets/themes/default/**/*.js'
    ]
  }

};
