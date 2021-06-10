'use strict';

// Generate AngularJS templates cache
// For more information about Grunt angular templates, have a look at https://www.npmjs.com/package/grunt-angular-templates
module.exports = {

  // Generates AngularJS templates cache for the administration interface
  'back-office': {
    options: {
      module: 'opa',
      url: (url) => {
        return `opa-${url.slice(url.lastIndexOf('/') + 1)}`;
      },
      htmlmin: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    },
    cwd: '<%= project.adminSourcesPath %>',
    src: 'components/**/*.html',
    dest: '<%= project.adminDeployJsPath %>/openveo-portal-admin.templates.js'
  }

};
