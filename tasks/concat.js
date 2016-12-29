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
        files.push(`<%= project.uglify %>/lib/${filePath.replace('js', 'min.js')}`);
      });
      return files;
    })(),
    dest: '<%= project.jsAssets %>/openveo-portal-lib.js'
  },

  // Concatenate compiled JavaScript files
  js: {
    src: (() => {
      const files = [];
      jsFile.forEach((filePath) => {
        files.push(`<%= project.uglify %>/${filePath.replace('js', 'min.js')}`);
      });
      return files;
    })(),
    dest: '<%= project.jsAssets %>/openveo-portal.js'
  }
};
