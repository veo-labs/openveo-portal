'use strict';

// Compass / SASS compilation
// For more information about Grunt compass, have a look at https://www.npmjs.com/package/grunt-contrib-compass
module.exports = {

  // Compile default theme SCSS for development
  dev: {
    options: {
      sourcemap: true,
      sassDir: '<%= project.sass %>',
      cssDir: '<%= project.assets %>/css',
      fontsDir: '<%= project.fonts %>',
      httpFontsPath: '<%= project.fontHttpPath %>',
      environment: 'development',
      specify: '<%= project.sass %>/style.scss',
      force: true
    }
  },

  // Compile default theme SCSS for distribution
  dist: {
    options: {
      sourcemap: false,
      sassDir: '<%= project.sass %>',
      cssDir: '<%= project.assets %>/css',
      fontsDir: '<%= project.fonts %>',
      httpFontsPath: '<%= project.fontHttpPath %>',
      environment: 'production',
      outputStyle: 'compressed',
      specify: '<%= project.sass %>/style.scss',
      force: true
    }
  }
};
