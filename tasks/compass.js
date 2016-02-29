'use strict';

// Compass / SASS compilation
// For more information about Grunt compass, have a look at https://www.npmjs.com/package/grunt-contrib-compass
module.exports = {

  // Compile Bootstrap SCSS for development
  devLib: {
    options: {
      sourcemap: true,
      sassDir: '<%= project.sass %>',
      cssDir: '<%= project.cssAssets %>',
      fontsDir: '<%= project.fonts %>',
      httpFontsPath: '<%= project.fontHttpPath %>',
      environment: 'development',
      specify: '<%= project.sass %>/bootstrap.scss',
      force: true
    }
  },

  // Compile Bootstrap SCSS for distribution
  distLib: {
    options: {
      sourcemap: false,
      sassDir: '<%= project.sass %>',
      cssDir: '<%= project.cssAssets %>',
      fontsDir: '<%= project.fonts %>',
      httpFontsPath: '<%= project.fontHttpPath %>',
      environment: 'production',
      outputStyle: 'compressed',
      specify: '<%= project.sass %>/bootstrap.scss',
      force: true
    }
  },

  // Compile default theme SCSS for development
  dev: {
    options: {
      sourcemap: true,
      sassDir: '<%= project.sass %>',
      cssDir: '<%= project.defaultTheme %>',
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
      cssDir: '<%= project.defaultTheme %>',
      fontsDir: '<%= project.fonts %>',
      httpFontsPath: '<%= project.fontHttpPath %>',
      environment: 'production',
      outputStyle: 'compressed',
      specify: '<%= project.sass %>/style.scss',
      force: true
    }
  }
};
