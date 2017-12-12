'use strict';

// Karma configuration
module.exports = (config) => {
  const resources = process.require('build/ng-admin-files.json');
  const conf = process.require('conf.json');
  const files = [];

  // Library scripts
  conf.be.scriptLibFiles.forEach((file) => {
    files.push(`assets${file}`);
  });

  // AngularJS mock and Chai Spies
  files.push('assets/lib/angular-mocks/angular-mocks.js');
  files.push('node_modules/chai-spies/chai-spies.js');

  // Back office sources
  files.push('assets/be/js/i18n/openveo-portal-locale_en.js');
  files.push('app/client/admin/components/**/*.html');
  resources.js.forEach((file) => {
    files.push(`app/client/admin/${file}`);
  });

  // Tests
  files.push('app/client/admin/**/*.spec.js');

  config.set({

    // Base path that will be used to resolve all patterns
    // (eg. files, exclude)
    basePath: '../../../',

    // Plugins to load
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-ng-html2js-preprocessor'
    ],

    // HTML templates mock
    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      cacheIdFromPath: (filepath) => {
        return filepath.replace(/^(.*\/)(.*)$/, (match, match1, match2) => {
          return `opa-${match2}`;
        });
      }
    },

    // Files to preprocess
    preprocessors: {
      'app/client/admin/components/**/*.html': ['ng-html2js']
    },

    // List of files / patterns to load in the browser
    files: files

  });

};
