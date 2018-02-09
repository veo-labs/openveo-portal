'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages content groups.
   *
   * @class OpaGroupsFactory
   * @param {Object} $http AngularJS $http service
   * @param {String} opaWebServiceBasePath Portal web service base path
   */
  function OpaGroupsFactory($http, opaWebServiceBasePath) {

    /**
     * Gets the list of OpenVeo groups.
     *
     * @return {HttpPromise} An AngularJS promise resolving with the list of groups
     * @method getGroups
     */
    function getGroups() {
      return $http.get(opaWebServiceBasePath + 'groups');
    }

    return {
      getGroups: getGroups
    };

  }

  app.factory('opaGroupsFactory', OpaGroupsFactory);
  OpaGroupsFactory.$inject = ['$http', 'opaWebServiceBasePath'];

})(angular.module('opa'));
