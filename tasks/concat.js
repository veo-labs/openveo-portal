'use strict';

require('../processRequire.js');
var applicationConf = process.require('conf.json');
var libFile = applicationConf['scriptLibFiles']['dev'];
var jsFile = applicationConf['scriptFiles']['dev'];

// Concatenate files
// For more information about Grunt concat, have a look at https://www.npmjs.com/package/grunt-contrib-concat
module.exports = {
  options: {
    separator: ';'
  },

  // Concatenate compiled JavaScript library files
  lib: {
    src: (function() {
      var files = [];
      libFile.forEach(function(filePath) {
        files.push('<%= project.uglify %>/lib/' + filePath.replace('js', 'min.js'));
      });
      return files;
    }()),
    dest: '<%= project.jsAssets %>/openveo-portal-lib.js'
  },

  // Concatenate compiled JavaScript files
  js: {
    src: (function() {
      var files = [];
      jsFile.forEach(function(filePath) {
        files.push('<%= project.uglify %>/' + filePath.replace('js', 'min.js'));
      });
      return files;
    }()),
    dest: '<%= project.jsAssets %>/openveo-portal.js'
  }
};
