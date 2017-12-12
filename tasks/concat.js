'use strict';

require('../processRequire.js');
const applicationConf = process.require('conf.json');
const libFile = applicationConf['scriptLibFiles']['dev'];
const jsFile = applicationConf['scriptFiles']['dev'];

// Concatenate files
// For more information about Grunt concat, have a look at https://www.npmjs.com/package/grunt-contrib-concat
module.exports = {
  options: {
    separator: ';'
  },

  // Concatenate compiled JavaScript library files
  lib: {
    src: (() => {
      const files = [];
      libFile.forEach((filePath) => {
        files.push(`<%= project.uglifyBuildPath %>/lib/${filePath.replace('js', 'min.js')}`);
      });
      return files;
    })(),
    dest: '<%= project.frontDeployJsPath %>/openveo-portal-lib.js'
  },

  // Concatenate compiled JavaScript files
  js: {
    src: (() => {
      const files = [];
      jsFile.forEach((filePath) => {
        files.push(`<%= project.uglifyBuildPath %>/${filePath.replace('js', 'min.js')}`);
      });
      return files;
    })(),
    dest: '<%= project.frontDeployJsPath %>/openveo-portal.js'
  },

  // Concatenate JavaScript files of the administration interface
  // Use grunt concat:admin --production to skip source maps generation
  // Not that src property is empty because it is filled by the admin-set-concat-src task
  // Consequently using this task directly won't have any effect
  admin: {
    options: {
      sourceMap: !process.production
    },
    src: [],
    dest: '<%= project.buildPath %>/openveo-portal-admin.js'
  }
};
