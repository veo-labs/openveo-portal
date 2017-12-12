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
   * @param {Object} $scope opa-toolbar isolated scope
   * @param {Object} $window JQLite element of the window
   * @param {Object} $mdMedia AngularJS Material service to evaluate media queries
   * @param {Object} $mdSidenav AngularJS Material service to manipulate sidenav directives
   * @param {Object} opaUserFactory User factory to manage authenticated user
   */
  function OpaToolbarController($scope, $window, $mdMedia, $mdSidenav, opaUserFactory) {
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
  OpaToolbarController.$inject = ['$scope', '$window', '$mdMedia', '$mdSidenav', 'opaUserFactory'];

})(angular.module('opa'));
