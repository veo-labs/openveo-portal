'use strict';

// Obfuscate javascript files
// For more information about Grunt uglify, have a look at https://www.npmjs.com/package/grunt-contrib-uglify
module.exports = {

  // Obfuscate project's client JavaScript files
  dist: {
    files: [
      {
        expand: true, // Enable dynamic expansion
        cwd: '<%= project.frontJS %>/', // Src matches are relative to this path
        src: ['**/*.js', '!ov/*.js'], // Actual pattern(s) to match
        dest: '<%= project.uglify %>/lib', // Destination path prefix
        ext: '.min.js', // Dest filepaths will have this extension
        extDot: 'first'   // Extensions in filenames begin after the first dot
      },
      {
        expand: true, // Enable dynamic expansion
        cwd: '<%= project.frontJS %>/', // Src matches are relative to this path
        src: ['ov/*.js'], // Actual pattern(s) to match
        dest: '<%= project.uglify %>/', // Destination path prefix
        ext: '.min.js', // Dest filepaths will have this extension
        extDot: 'first'   // Extensions in filenames begin after the first dot
      }
    ]
  }

};
