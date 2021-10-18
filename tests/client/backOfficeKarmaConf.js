'use strict';

const path = require('path');

require('../../processRequire.js');
const baseConf = require('./karmaConf.js');

/**
 * Finds a library in top level "libraries" property of the conf.json file.
 *
 * @param {String} mountPath The library mount path to look for
 * @return {Object} The library
 */
function findLibraryByMountPath(mountPath) {
  const conf = process.require('conf.json');

  for (let library of conf.libraries) {
    if (library.mountPath === mountPath) return library;
  }

  return null;
}

// Karma configuration
module.exports = (config) => {
  const resources = process.require('build/ng-admin-files.json');
  const conf = process.require('conf.json');
  const files = [];

  // Library scripts
  conf.be.libraries.forEach((backEndLibrary) => {
    const library = findLibraryByMountPath(backEndLibrary.mountPath);
    backEndLibrary.files.forEach((libraryFilePath) => {
      if (/.js$/.test(libraryFilePath)) {
        const libraryPath = path.dirname(require.resolve(path.join(library.name, 'package.json')));
        files.push(path.join(libraryPath, libraryFilePath));
      }
    });
  });

  // AngularJS mock and Chai Spies
  files.push('node_modules/angular-mocks/angular-mocks.js');
  files.push('node_modules/chai-spies/chai-spies.js');

  // Back office sources
  files.push('assets/be/js/i18n/openveo-portal-locale_en.js');
  files.push('app/client/admin/components/**/*.html');
  resources.js.forEach((file) => {
    files.push(`app/client/admin/${file}`);
  });

  // Tests
  files.push('app/client/admin/**/*.spec.js');

  config.set(Object.assign(baseConf, {

    // Base path that will be used to resolve all patterns
    // (eg. files, exclude)
    basePath: '../../',

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

  }));

};
