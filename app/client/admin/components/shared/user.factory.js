'use strict';

(function(app) {

  /**
   * Manages authenticated user.
   *
   * @class OpaUserFactory
   * @memberof module:opa
   * @inner
   * @param {Object} $http AngularJS $http service
   * @param {Object} $cookies AngularJS $cookies service
   * @param {String} opaWebServiceBasePath Portal web service base path
   */
  function OpaUserFactory($http, $cookies, opaWebServiceBasePath) {
    var language = ($cookies.get('language') || navigator.language || navigator.browserLanguage).split('-')[0];

    /**
     * Gets user information.
     *
     * @memberof module:opa~OpaUserFactory
     * @instance
     * @return {Object} The user description object
     */
    function getUserInfo() {
      return openVeoPortalSettings.user;
    }

    /**
     * Indicates if user is authenticated or not.
     *
     * @memberof module:opa~OpaUserFactory
     * @instance
     * @return {Boolean} true if authenticated, false otherwise
     */
    function isAuthenticated() {
      return openVeoPortalSettings.user ? true : false;
    }

    /**
     * Logs out user.
     *
     * @memberof module:opa~OpaUserFactory
     * @instance
     * @return {HttPromise} The logout promise
     */
    function logout() {
      return $http.post(opaWebServiceBasePath + 'logout');
    }

    /**
     * Gets user's preferred language.
     *
     * @memberof module:opa~OpaUserFactory
     * @instance
     * @return {String} The user's language code
     */
    function getLanguage() {
      return language;
    }

    /**
     * Sets user's preferred language.
     *
     * @memberof module:opa~OpaUserFactory
     * @instance
     * @param {String} newLanguage A language country code (e.g en-CA)
     */
    function setLanguage(newLanguage) {
      language = newLanguage;
      $cookies.put('language', language);
    }

    return {
      getUserInfo: getUserInfo,
      isAuthenticated: isAuthenticated,
      logout: logout,
      getLanguage: getLanguage,
      setLanguage: setLanguage
    };

  }

  app.factory('opaUserFactory', OpaUserFactory);
  OpaUserFactory.$inject = ['$http', '$cookies', 'opaWebServiceBasePath'];

})(angular.module('opa'));
