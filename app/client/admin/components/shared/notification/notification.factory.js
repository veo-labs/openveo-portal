'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Creates toasts notifications.
   *
   * Requires:
   * - **ngMaterial** AngularJS Material module
   * - **opaTranslate** Internationalization translate filter
   *
   * @class OpaNotificationFactory
   * @param {Object} $mdToast AngularJS Material media query service
   */
  function OpaNotificationFactory($mdToast) {

    /**
     * Displays a notification using AngularJS Material toaster.
     *
     * @method displayNotification
     * @param {String} message The message to display
     * @param {Number} [delay] Duration (in milliseconds) before automatically closing the notification,
     * 0 to add a button to close the notification
     */
    function displayNotification(message, delay) {
      if (!message) return;
      delay = Math.max(delay, 0) || 0;

      $mdToast.show($mdToast.build({
        hideDelay: delay,
        templateUrl: 'opa-notification.html',
        controller: 'OpaNotificationController',
        controllerAs: 'ctrl',
        bindToController: true,
        locals: {
          message: message,
          closeButton: delay === 0
        }
      }));
    }

    return {
      displayNotification: displayNotification
    };

  }

  app.factory('opaNotificationFactory', OpaNotificationFactory);
  OpaNotificationFactory.$inject = ['$mdToast'];

})(angular.module('opa'));
