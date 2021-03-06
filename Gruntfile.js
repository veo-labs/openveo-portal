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

  // Set "production" property which will be used by grunt tasks to set appropriate configuration
  process.production = (process.argv.length > 3 && process.argv[3] === '--production') ? true : false;

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

  // Listen to changes on SCSS files and generate CSS files
  grunt.registerTask('default', ['compass:dev', 'watch']);

  // Launch end to end tests
  // e.g. grunt test-e2e --capabilities="{\"browserName\": \"chrome\"}" --directConnect=true
  // e.g. grunt test-e2e --capabilities="{\"browserName\": \"firefox\"}" --directConnect=true
  // e.g. grunt test-e2e --capabilities="{\"browserName\": \"internet explorer\"}"
  grunt.registerTask('test-e2e', ['protractor']);

  // Minify and concat AngularJS Javascript files
  grunt.registerTask('compile-js', ['uglify:dist', 'concat:lib', 'concat:js']);

  // Generate documentation
  grunt.registerTask('doc', ['remove:doc', 'mkdocs', 'yuidoc', 'rename:doc']);

  // Prepare project for production
  grunt.registerTask('dist', ['remove:build', 'compass:dist', 'compile-js', 'build-admin']);

  // Deploy documentation to github pages
  grunt.registerTask('deploy-doc', ['doc', 'gh-pages:doc']);

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

  // Build the administration interface
  grunt.registerTask('build-admin', [
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
  grunt.registerTask('unit-tests', ['ngDp:backOffice', 'karma:backOffice', 'karma:frontOffice']);

};
