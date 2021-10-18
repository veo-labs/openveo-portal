'use strict';

(function(app) {

  /**
   * Manages storage of OpenVeo Portal settings.
   *
   * @class OpaSettingsFactory
   * @memberof module:opa
   * @inner
   * @param {Object} $http AngularJS $http service
   * @param {String} opaWebServiceBasePath Portal web service base path
   */
  function OpaSettingsFactory($http, opaWebServiceBasePath) {

    /**
     * Gets a portal setting.
     *
     * @memberof module:opa~OpaSettingsFactory
     * @instance
     * @param {String} settingId The id of the setting to fetch
     * @return {HttpPromise} An AngularJS promise resolving with an object containing the value of the setting
     */
    function getSetting(settingId) {
      return $http.get(opaWebServiceBasePath + 'settings/' + settingId);
    }

    /**
     * Updates a portal setting.
     *
     * @memberof module:opa~OpaSettingsFactory
     * @instance
     * @param {String} settingId The id of the setting to update / add
     * @param {*} value The value of the setting
     * @return {HttpPromise} An AngularJS promise resolving with
     * {@link module:opa~OpaSettingsFactory~UpdateSettingResult|UpdateSettingResult}
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

/**
 * Update setting result.
 *
 * @typedef {Object} module:opa~OpaSettingsFactory~UpdateSettingResult
 * @property {String} status 'ok' if success, 'ko' otherwise
 */
