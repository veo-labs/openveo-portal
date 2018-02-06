'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaToolbar component.
   *
   * @class OpaToolbarController
   * @constructor
   * @param {Object} $mdMedia AngularJS Material service to evaluate media queries
   */
  function OpaToolbarController($mdMedia) {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * AngularJS Material $mdMedia service.
       *
       * @property $mdMedia
       * @type Object
       * @final
       */
      $mdMedia: {
        value: $mdMedia
      }

    });
  }

  app.controller('OpaToolbarController', OpaToolbarController);
  OpaToolbarController.$inject = ['$mdMedia'];

})(angular.module('opa'));
