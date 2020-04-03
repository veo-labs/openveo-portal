'use strict';

// Obfuscate javascript files
// For more information about Grunt uglify, have a look at https://www.npmjs.com/package/grunt-contrib-uglify
module.exports = {

  // Obfuscate project's client JavaScript files
  dist: {
    files: [
      {
        expand: true, // Enable dynamic expansion
        cwd: '<%= project.frontJsSourcesPath %>/', // Src matches are relative to this path
        src: ['**/*.js', '!ov/*.js'], // Actual pattern(s) to match
        dest: '<%= project.uglifyBuildPath %>/lib', // Destination path prefix
        ext: '.min.js', // Dest filepaths will have this extension
        extDot: 'first' // Extensions in filenames begin after the first dot
      },
      {
        expand: true, // Enable dynamic expansion
        cwd: '<%= project.frontJsSourcesPath %>/', // Src matches are relative to this path
        src: ['ov/*.js'], // Actual pattern(s) to match
        dest: '<%= project.uglifyBuildPath %>/', // Destination path prefix
        ext: '.min.js', // Dest filepaths will have this extension
        extDot: 'first' // Extensions in filenames begin after the first dot
      }
    ]
  },

  // Obfuscate JavaScript files of the administration interface
  // Use grunt uglify:admin --production to skip source maps generation
  // Not that this task should be run after concat:admin
  admin: {
    options: {
      sourceMap: !process.production,
      sourceMapIn: !process.production ? '<%= project.buildPath %>/openveo-portal-admin.js.map' : null
    },
    expand: true,
    cwd: '<%= project.buildPath %>/',
    src: ['openveo-portal-admin.js'],
    ext: '.min.js',
    extDot: 'last',
    dest: '<%= project.adminDeployJsPath %>/'
  }

};
