'use strict';

/* eslint no-sync: 0 */
require('./processRequire.js');
const fs = require('fs');
const openVeoApi = require('@openveo/api');

/**
 * Loads a bunch of grunt configuration files from the given directory.
 *
 * Loaded configurations can be referenced using the configuration file name.
 * For example, if myConf.js returns an object with a property "test", it will be accessible using myConf.test.
 *
 * @param {String} path Path of the directory containing configuration files
 * @return {Object} The list of configurations indexed by filename without the extension
 */
function loadConfig(path) {
  const configuration = {};
  const configurationFiles = fs.readdirSync(path);

  for (const configurationFile of configurationFiles)
    configuration[configurationFile.replace(/\.js$/, '')] = require(`${path}/${configurationFile}`);

  return configuration;
}

/**
 * Initializes grunt, load extensions and register tasks.
 */
module.exports = function(grunt) {
  const config = {
    pkg: grunt.file.readJSON('package.json'),
    env: process.env
  };

  // Set "withSourceMaps" property which will be used by grunt tasks to set appropriate configuration
  process.withSourceMaps = (process.argv.length > 3 && process.argv[3] === '--with-source-maps') ? true : false;

  grunt.initConfig(config);

  // Load tasks definitions
  grunt.config.merge(loadConfig('./tasks'));

  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mkdocs');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerMultiTask('rename', openVeoApi.grunt.renameTask(grunt));
  grunt.registerMultiTask('remove', openVeoApi.grunt.removeTask(grunt));
  grunt.registerMultiTask('ngDp', openVeoApi.grunt.ngDpTask(grunt));

  // Generate documentation
  grunt.registerTask('doc', ['remove:doc', 'mkdocs', 'yuidoc', 'rename:doc']);

  // Dynamically set src property of the concat:admin task
  // The list of sources is built dynamically by the ngDp:backOffice task
  grunt.registerTask('admin-set-concat-src', 'Set src of concat:admin task', () => {

    // Get the list of sources to concat from the results of ngDp:backOffice task
    const resources = process.require('build/ng-admin-files.json');
    var concat = grunt.config('concat');
    concat.admin.src = [];

    resources.js.forEach((resourcePath) => {
      concat.admin.src.push(`<%= project.adminSourcesPath %>/${resourcePath}`);
    });

    grunt.config('concat', concat);
  });

  // Build the front office
  grunt.registerTask('build-front-office-client', [
    'compass:front',
    'uglify:front',
    'concat:front-lib',
    'concat:front-js'
  ]);

  // Build the back office
  grunt.registerTask('build-back-office-client', [
    'ngDp:backOffice',
    'replace:admin-inject-scss',
    'replace:admin-inject-scripts',
    'compass:admin',
    'replace:admin-font-paths',
    'admin-set-concat-src',
    'concat:admin',
    'uglify:admin',
    'copy:admin-html-root',
    'ngtemplates:admin'
  ]);

  // Launch back office unit tests
  grunt.registerTask('back-office-client-unit-tests', ['ngDp:backOffice', 'karma:backOffice']);

};
