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
   */
  function OpaGroupsFactory($http) {

    /**
     * Gets the list of OpenVeo groups.
     *
     * @return {HttpPromise} An AngularJS promise resolving with the list of groups
     * @method getGroups
     */
    function getGroups() {
      return $http.get('groups');
    }

    return {
      getGroups: getGroups
    };

  }

  app.factory('opaGroupsFactory', OpaGroupsFactory);
  OpaGroupsFactory.$inject = ['$http'];

})(angular.module('opa'));
