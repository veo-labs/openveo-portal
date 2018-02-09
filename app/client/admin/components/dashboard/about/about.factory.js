'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages information about actual version of OpenVeo Portal.
   *
   * @class OpaAboutFactory
   * @param {Object} $http AngularJS $http service
   * @param {String} opaWebServiceBasePath Portal web service base path
   */
  function OpaAboutFactory($http, opaWebServiceBasePath) {

    /**
     * Gets information about OpenVeo Portal.
     *
     * @return {HttpPromise} An AngularJS promise resolving with an object containing:
     *   - [String] **latestVersion** Latest OpenVeo Portal version available
     *   - [String] **latestVersionUrl** Latest OpenVeo Portal version release note url
     *   - [Boolean] **updateAvailable** true if a new version of OpenVeo Portal is available, false otherwise
     *   - [String] **version** The actual version of OpenVeo Portal
     *   - [String] **versionReleaseUrl** Actual OpenVeo Portal version release note url
     *   - [String] **versionSourcesUrl** Actual OpenVeo Portal version sources url
     * @method getInfo
     */
    function getInfo() {
      return $http.get(opaWebServiceBasePath + 'version');
    }

    return {
      getInfo: getInfo
    };

  }

  app.factory('opaAboutFactory', OpaAboutFactory);
  OpaAboutFactory.$inject = ['$http', 'opaWebServiceBasePath'];

})(angular.module('opa'));
