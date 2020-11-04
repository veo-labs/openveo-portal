'use strict';

// Karma configuration
module.exports = function(config) {

  config.set({

    // Base path that will be used to resolve all patterns
    // (eg. files, exclude)
    basePath: '../../',

    // Plugins to load
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-chrome-launcher'
    ],

    // List of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-cookies/angular-cookies.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-messages/angular-messages.js',
      'node_modules/angular-material/angular-material.js',
      'node_modules/angulartics/dist/angulartics.min.js',
      'node_modules/angulartics-piwik/dist/angulartics-piwik.min.js',
      'node_modules/chai-spies/chai-spies.js',
      'node_modules/he/he.js',
      'node_modules/@openveo/player/dist/openveo-player.js',
      'assets/themes/default/i18n/openveo-portal-locale_en.js',
      'assets/themes/default/conf.js',
      'tests/client/unitTests/init.js',
      'app/client/front/js/authentication/AuthenticationApp.js',
      'app/client/front/js/i18n/I18nApp.js',
      'app/client/front/js/storage/StorageApp.js',
      'app/client/front/js/ov/OvApp.js',
      'app/client/front/views/*.html',
      'app/client/front/js/**/*.js',
      'tests/client/unitTests/*.js'
    ]

  });

};

