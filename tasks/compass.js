'use strict';

// Compass / SASS compilation
// For more information about Grunt compass, have a look at https://www.npmjs.com/package/grunt-contrib-compass
module.exports = {

  // Build the front office stylesheet
  // Use grunt compass:front --with-source-maps to add source maps generation
  front: {
    options: {
      sourcemap: process.withSourceMaps,
      sassDir: '<%= project.frontScssSourcesPath %>',
      cssDir: '<%= project.frontDeployCssPath %>',
      environment: 'production',
      outputStyle: 'compressed',
      specify: '<%= project.frontScssSourcesPath %>/style.scss',
      force: true
    }
  },

  // Build the back office stylesheet
  // Use grunt compass:back-office --with-source-maps to add source maps generation
  'back-office': {
    options: {
      sourcemap: process.withSourceMaps,
      sassDir: '<%= project.compassBuildPath %>',
      cssDir: '<%= project.compassBuildPath %>',
      environment: 'production',
      outputStyle: 'compressed',
      specify: '<%= project.compassBuildPath %>/index.scss',
      force: true
    }
  }
};
