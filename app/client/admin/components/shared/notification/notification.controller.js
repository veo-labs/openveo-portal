'use strict';

/**
 * @module opa/notification
 */

(function(app) {

  /**
   * Manages notifications.
   *
   * @class OpaNotificationController
   * @memberof module:opa/notification
   * @inner
   * @constructor
   * @param {Object} $mdToast AngularJS Material toast service
   * @param {Object} $mdMedia AngularJS Material media query service
   */
  function OpaNotificationController($mdToast, $mdMedia) {
    var ctrl = this;

    Object.defineProperties(ctrl,

      /** @lends module:opa/notification~OpaNotificationController */
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
        },

        /**
         * Hides the notification.
         *
         * @memberof module:opa/notification~OpaNotificationController
         * @method hide
         * @instance
         */
        hide: {
          value: function() {
            $mdToast.hide();
          }
        }

      }

    );
  }

  app.controller('OpaNotificationController', OpaNotificationController);
  OpaNotificationController.$inject = ['$mdToast', '$mdMedia'];

})(angular.module('opa'));
