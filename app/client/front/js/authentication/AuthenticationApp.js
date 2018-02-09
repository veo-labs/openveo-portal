'use strict';

/**
 * Service to authenticate / logout or manipulate authenticated user informations.
 *
 * @module ov.authentication
 * @main ov.authentication
 */

(function(angular) {
  var app = angular.module('ov.authentication', []);

  /**
   * Defines an authentication service to deal with user authentication.
   * Exposes methods to deal with user information and to sign in or logout.
   *
   * @class authenticationService
   */
  function AuthenticationService($http, webServiceBasePath) {
    var userInfo;

    /**
     * Initializes user information.
     */
    function init() {
      userInfo = openVeoPortalSettings.user;
    }

    /**
     * Signs in using the given credentials.
     *
     * @param {String} login The login
     * @param {String} password The password
     * @return {HttPromise} The authentication promise
     * @method login
     */
    function login(login, password) {
      return $http.post(webServiceBasePath + 'authenticate', {
        login: login,
        password: password
      });
    }

    /**
     * Logs out user.
     *
     * @return {HttPromise} The logout promise
     * @method logout
     */
    function logout() {
      return $http.post('/be' + webServiceBasePath + 'logout');
    }

    /**
     * Gets user information.
     *
     * @return {Object} The user description object
     * @method getUserInfo
     */
    function getUserInfo() {
      return userInfo;
    }

    /**
     * Sets user information.
     *
     * @param {Object} [info] The user description object or null to remove all user information
     * @method setUserInfo
     */
    function setUserInfo(info) {
      userInfo = (info) ? info : null;
    }

    init();

    return {
      login: login,
      logout: logout,
      getUserInfo: getUserInfo,
      setUserInfo: setUserInfo
    };

  }

  app.factory('authenticationService', AuthenticationService);
  AuthenticationService.$inject = ['$http', 'webServiceBasePath'];

})(angular);
