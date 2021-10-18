'use strict';

(function(app) {

  /**
   * Manages information about actual version of OpenVeo Portal.
   *
   * @class OpaAboutFactory
   * @memberof module:opa/dashboard/about
   * @inner
   * @param {Object} $http AngularJS $http service
   * @param {String} opaWebServiceBasePath Portal web service base path
   */
  function OpaAboutFactory($http, opaWebServiceBasePath) {

    /**
     * Gets information about OpenVeo Portal.
     *
     * @memberof module:opa/dashboard/about~OpaAboutFactory
     * @instance
     * @return {HttpPromise} An AngularJS promise resolving with
     * {@link module:opa/dashboard/about~OpaAboutFactory~PortalInformation|PortalInformation}
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

/**
 * Information about OpenVeo Portal.
 *
 * @typedef {Object} module:opa/dashboard/about~OpaAboutFactory~PortalInformation
 * @property {String} latestVersion Latest OpenVeo Portal version available
 * @property {String} latestVersionUrl Latest OpenVeo Portal version release note url
 * @property {Boolean} updateAvailable true if a new version of OpenVeo Portal is available, false otherwise
 * @property {String} version The actual version of OpenVeo Portal
 * @property {String} versionReleaseUrl Actual OpenVeo Portal version release note url
 * @property {String} versionSourcesUrl Actual OpenVeo Portal version sources url
 */
