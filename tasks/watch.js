'use strict';

// Watch files for modifications
// For more information about Grunt watch, have a look at https://www.npmjs.com/package/grunt-contrib-watch
module.exports = {

  // Automatically rebuild front office when a file is modified
  front: {
    files: [
      '<%= project.frontScssSourcesPath %>/**/*',
      '<%= project.frontJsSourcesPath %>/**/*',
      '<%= project.frontThemesSourcesPath %>/**/*',
      '<%= project.frontViewsSourcesPath %>/**/*',
      '<%= project.root %>/conf.json'
    ],
    tasks: [
      'build-front-office-client'
    ]
  },

  // Automatically rebuild back office when a file is modified
  admin: {
    files: [
      '<%= project.adminSourcesPath %>/**/*',
      '!<%= project.adminSourcesPath %>/**/*.spec.js',
      '<%= project.adminI18nSourcesPath %>/*.js',
      '<%= project.root %>/conf.json'
    ],
    tasks: [
      'build-back-office-client'
    ]
  }

};
