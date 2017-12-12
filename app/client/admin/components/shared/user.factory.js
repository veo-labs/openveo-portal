'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages authenticated user.
   *
   * @class OpaUserFactory
   * @param {Object} $http AngularJS $http service
   * @param {Object} $cookies AngularJS $cookies service
   */
  function OpaUserFactory($http, $cookies) {
    var language = ($cookies.get('language') || navigator.language || navigator.browserLanguage).split('-')[0];

    /**
     * Gets user information.
     *
     * @return {Object} The user description object
     * @method getUserInfo
     */
    function getUserInfo() {
      return openVeoPortalSettings.user;
    }

    /**
     * Indicates if user is authenticated or not.
     *
     * @method isAuthenticated
     * @return {Boolean} true if authenticated, false otherwise
     */
    function isAuthenticated() {
      return openVeoPortalSettings.user ? true : false;
    }

    /**
     * Logs out user.
     *
     * @return {HttPromise} The logout promise
     * @method logout
     */
    function logout() {
      return $http.post('logout');
    }

    /**
     * Gets user's preferred language.
     *
     * @method getLanguage
     * @return {String} The user's language code
     */
    function getLanguage() {
      return language;
    }

    /**
     * Sets user's preferred language.
     *
     * @param {String} newLanguage A language country code (e.g en-CA)
     * @method setLanguage
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
  OpaUserFactory.$inject = ['$http', '$cookies'];

})(angular.module('opa'));
