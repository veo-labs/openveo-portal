'use strict';

// Copy files
// For more information about Grunt copy, have a look at https://www.npmjs.com/package/grunt-contrib-copy
module.exports = {

  // Copy compiled admin HTML root file into public directory
  'admin-html-root': {
    cwd: '<%= project.buildPath %>',
    src: 'index.html',
    dest: '<%= project.adminDeployViewsPath %>/',
    expand: true
  }

};
