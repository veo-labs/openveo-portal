'use strict';

const path = require('path');

// Replace placeholders
// For more information about Grunt replace, have a look at https://www.npmjs.com/package/grunt-replace
module.exports = {

  // Inject SCSS files of the administration interface into its main SCSS file
  // It makes sure SCSS files are loaded in the right order
  // Note that it must be run after ngDp:back-office task
  'back-office-inject-scss': {
    options: {
      usePrefix: false,
      patterns: [
        {
          json: (done) => {
            const resources = process.require('build/ng-admin-files.json');
            let adminScss = '';
            let fontScss = '';

            resources.css.forEach((resource) => {
              adminScss += `@import "${resource}";\n`;
            });

            fontScss += '@import "../../node_modules/roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss";\n';

            done({
              '// INJECT_SCSS': adminScss,
              '// INJECT_FONT_SCSS': fontScss
            });
          }
        }
      ]
    },
    cwd: '<%= project.adminSourcesPath %>',
    src: 'index.scss',
    dest: '<%= project.compassBuildPath %>/',
    expand: true
  },

  // Inject JavaScript library files of the administration interface into root HTML
  // Injected scripts are retrieved from conf.json file
  'back-office-inject-scripts': {
    options: {
      usePrefix: false,
      patterns: [
        {
          json: (done) => {
            const conf = process.require('conf.json');
            let libraryScriptsHtml = '';

            conf.be.libraries.forEach((library) => {
              library.files.forEach((libraryFilePath) => {
                if (/.js$/.test(libraryFilePath)) {
                  const libraryFileUri = path.join('/', library.mountPath, libraryFilePath);
                  libraryScriptsHtml += `<script src="${libraryFileUri}"></script>\n`;
                }
              });
            });

            done({
              '// INJECT_LIBRARY_SCRIPTS': libraryScriptsHtml
            });
          }
        }
      ]
    },
    cwd: '<%= project.adminSourcesPath %>',
    src: 'index.html',
    dest: '<%= project.buildPath %>/',
    expand: true
  },

  // Replace admin font path from index.css file
  'back-office-font-paths': {
    options: {
      usePrefix: false,
      patterns: [
        {
          match: '../../../fonts/roboto/',
          replacement: '/roboto-fontface/fonts/roboto/'
        }
      ]
    },
    cwd: '<%= project.compassBuildPath %>',
    src: 'index.css',
    dest: '<%= project.adminDeployCssPath %>/',
    expand: true
  }

};
