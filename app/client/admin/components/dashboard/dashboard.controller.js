'use strict';

(function(app) {

  /**
   * Manages opaDashboard component.
   *
   * @class OpaDashboardController
   * @memberof module:opa/dashboard
   * @inner
   * @constructor
   * @param {Object} $scope The component isolated scope
   */
  function OpaDashboardController($scope) {
    var ctrl = this;

    Object.defineProperties(ctrl,

      /** @lends module:opa/dashboard~OpaDashboardController */
      {

        /**
         * Initializes controller and informs when component is loaded.
         *
         * @memberof module:opa/dashboard~OpaDashboardController
         * @method $onInit
         * @instance
         */
        $onInit: {
          value: function() {
            $scope.$emit('opaViewLoaded');
          }
        }

      }

    );
  }

  app.controller('OpaDashboardController', OpaDashboardController);
  OpaDashboardController.$inject = ['$scope'];

})(angular.module('opa'));
