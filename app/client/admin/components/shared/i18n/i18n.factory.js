'use strict';

(function(app) {

  /**
   * Manages languages.
   *
   * @class OpaI18nFactory
   * @memberof module:opa/i18n
   * @inner
   */
  function OpaI18nFactory() {

    /**
     * Gets the list of supported languages.
     *
     * @memberof module:opa/i18n~OpaI18nFactory
     * @instance
     * @return {Array} The list of language country codes
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
