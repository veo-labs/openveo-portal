'use strict';

/**
 * Search settings component presents a formular to configure OpenVeo Portal search engine.
 *
 * Available attributes are:
 *   - [Object] **[opa-settings]**: The search settings with:
 *     - [Boolean] **[pois]**: true to also perform search in points of interest, false otherwise
 *   - [Function] **[opa-on-update]**: Function to call when search settings have been modified
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaTranslate** Internationalization translate filter
 * - **opaInfoButton** Component used to display info actions
 *
 * @example
 * <opa-search-settings></opa-search-settings>
 *
 * @module opa/settings/searchSettings
 */

(function(app) {

  app.component('opaSearchSettings', {
    templateUrl: 'opa-searchSettings.html',
    controller: 'OpaSearchSettingsController',
    bindings: {
      opaSettings: '<',
      opaOnUpdate: '&'
    }
  });

})(angular.module('opa'));

