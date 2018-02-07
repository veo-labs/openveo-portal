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
   *
   * @class OpaNotificationFactory
   * @param {Object} $mdToast AngularJS Material media query service
   * @param {Object} opaNotificationConfiguration OPA notifications configuration service
   */
  function OpaNotificationFactory($mdToast, opaNotificationConfiguration) {
    var defaultOptions = opaNotificationConfiguration.getOptions();

    /**
     * Displays a notification using AngularJS Material toaster.
     *
     * @method displayNotification
     * @param {String} message The message to display
     * @param {Number} [delay] Duration (in milliseconds) before automatically closing the notification,
     * 0 to add a button to close the notification
     * @param {String} [closeLabel] Close button label
     * @param {String} [closeAriaLabel] Close button ARIA label
     */
    function displayNotification(message, delay, closeLabel, closeAriaLabel) {
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
          closeButton: delay === 0,
          closeLabel: closeLabel || defaultOptions.closeLabel,
          closeAriaLabel: closeAriaLabel || defaultOptions.closeAriaLabel
        }
      }));
    }

    return {
      displayNotification: displayNotification
    };

  }

  app.factory('opaNotificationFactory', OpaNotificationFactory);
  OpaNotificationFactory.$inject = ['$mdToast', 'opaNotificationConfiguration'];

})(angular.module('opa'));
