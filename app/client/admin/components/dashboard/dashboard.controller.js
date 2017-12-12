'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaDashboard component.
   *
   * @class OpaDashboardController
   * @constructor
   * @param {Object} $scope The component isolated scope
   */
  function OpaDashboardController($scope) {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * Initializes controller and informs when component is loaded.
       *
       * @method $onInit
       * @final
       */
      $onInit: {
        value: function() {
          $scope.$emit('opaViewLoaded');
        }
      }

    });
  }

  app.controller('OpaDashboardController', OpaDashboardController);
  OpaDashboardController.$inject = ['$scope'];

})(angular.module('opa'));
