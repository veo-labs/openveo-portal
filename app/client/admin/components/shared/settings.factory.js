'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages storage of OpenVeo Portal settings.
   *
   * @class OpaSettingsFactory
   * @param {Object} $http AngularJS $http service
   * @param {String} opaWebServiceBasePath Portal web service base path
   */
  function OpaSettingsFactory($http, opaWebServiceBasePath) {

    /**
     * Gets a portal setting.
     *
     * @param {String} settingId The id of the setting to fetch
     * @return {HttpPromise} An AngularJS promise resolving with an object containing the value of the setting
     * @method getSetting
     */
    function getSetting(settingId) {
      return $http.get(opaWebServiceBasePath + 'settings/' + settingId);
    }

    /**
     * Updates a portal setting.
     *
     * @param {String} settingId The id of the setting to update / add
     * @param {Mixed} value The value of the setting
     * @return {HttpPromise} An AngularJS promise resolving with an object containing:
     *   - [String|null] **error** The error message or null if no error
     *   - [String] **status** 'ok' if success, 'ko' otherwise
     * @method updateSetting
     */
    function updateSetting(settingId, value) {
      return $http.post(opaWebServiceBasePath + 'settings/' + settingId, {
        value: value
      });
    }

    return {
      getSetting: getSetting,
      updateSetting: updateSetting
    };

  }

  app.factory('opaSettingsFactory', OpaSettingsFactory);
  OpaSettingsFactory.$inject = ['$http', 'opaWebServiceBasePath'];

})(angular.module('opa'));
