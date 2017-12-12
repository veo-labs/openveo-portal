'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages notifications.
   *
   * @class OpaNotificationController
   * @constructor
   * @param {Object} $mdToast AngularJS Material toast service
   * @param {Object} $mdMedia AngularJS Material media query service
   */
  function OpaNotificationController($mdToast, $mdMedia) {
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
      },

      /**
       * Hides the notification.
       *
       * @method hide
       * @final
       */
      hide: {
        value: function() {
          $mdToast.hide();
        }
      }

    });
  }

  app.controller('OpaNotificationController', OpaNotificationController);
  OpaNotificationController.$inject = ['$mdToast', '$mdMedia'];

})(angular.module('opa'));
