'use strict';

// Compass / SASS compilation
// For more information about Grunt compass, have a look at https://www.npmjs.com/package/grunt-contrib-compass
module.exports = {

  // Compile default theme SCSS for development
  dev: {
    options: {
      sourcemap: true,
      sassDir: '<%= project.frontScssSourcesPath %>',
      cssDir: '<%= project.frontDeployCssPath %>',
      environment: 'development',
      specify: '<%= project.frontScssSourcesPath %>/style.scss',
      force: true
    }
  },

  // Compile default theme SCSS for distribution
  dist: {
    options: {
      sourcemap: false,
      sassDir: '<%= project.frontScssSourcesPath %>',
      cssDir: '<%= project.frontDeployCssPath %>',
      environment: 'production',
      outputStyle: 'compressed',
      specify: '<%= project.frontScssSourcesPath %>/style.scss',
      force: true
    }
  },

  // Build the administration interface stylesheet
  // Use grunt compass:admin --production to skip source maps generation
  admin: {
    options: {
      sourcemap: !process.production,
      sassDir: '<%= project.compassBuildPath %>',
      cssDir: '<%= project.compassBuildPath %>',
      environment: 'production',
      outputStyle: 'compressed',
      specify: '<%= project.compassBuildPath %>/index.scss',
      force: true
    }
  }
};
