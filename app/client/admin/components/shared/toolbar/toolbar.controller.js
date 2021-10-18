'use strict';

(function(app) {

  /**
   * Manages opaToolbar component.
   *
   * @class OpaToolbarController
   * @memberof module:opa/toolbar
   * @inner
   * @constructor
   * @param {Object} $mdMedia AngularJS Material service to evaluate media queries
   */
  function OpaToolbarController($mdMedia) {
    var ctrl = this;

    Object.defineProperties(ctrl,

      /** @lends module:opa/toolbar~OpaToolbarController */
      {

        /**
         * AngularJS Material $mdMedia service.
         *
         * @type {Object}
         * @instance
         * @readonly
         */
        $mdMedia: {
          value: $mdMedia
        }

      }

    );
  }

  app.controller('OpaToolbarController', OpaToolbarController);
  OpaToolbarController.$inject = ['$mdMedia'];

})(angular.module('opa'));
