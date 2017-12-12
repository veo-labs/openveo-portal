'use strict';

/**
 * @module opa.i18n
 */

(function(app) {

  /**
   * Manages languages.
   *
   * @class OpaI18nFactory
   */
  function OpaI18nFactory() {

    /**
     * Gets the list of supported languages.
     *
     * @return {Array} The list of language country codes
     * @method getLanguages
     */
    function getLanguages() {
      return openVeoPortalSettings.languages;
    }

    return {
      getLanguages: getLanguages
    };

  }

  app.factory('opaI18nFactory', OpaI18nFactory);
  OpaI18nFactory.$inject = [];

})(angular.module('opa'));
