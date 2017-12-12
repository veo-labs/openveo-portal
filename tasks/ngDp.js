'use strict';

// Builds AngularJS applications dependencies file
// For more information about Grunt ngDp, have a look at https://github.com/veo-labs/openveo-api
module.exports = {

  // Generates a file containing the ordered list of SCSS and JavaScript files
  // of the administration interface
  // Paths will be transformed, replacing basePath by cssPrefix or jsPrefix
  backOffice: {
    options: {
      basePath: '<%= project.adminSourcesPath %>/',
      cssPrefix: '../../app/client/admin/'
    },
    files: [
      {
        src: [
          '<%= project.adminSourcesPath %>/**/*.*',
          '!<%= project.adminSourcesPath %>/index.scss',
          '!<%= project.adminSourcesPath %>/**/*.spec.js'
        ],
        dest: '<%= project.buildPath %>/ng-admin-files.json'
      }
    ]
  }

};
