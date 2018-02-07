'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages OPA notifications default configuration.
   *
   * @class opaNotificationConfiguration
   */
  function OpaNotificationConfiguration() {
    var self = this;

    Object.defineProperties(this, {

      /**
       * The default options for all notifications.
       *
       * @property options
       * @type Object
       * @final
       */
      options: {
        value: {}
      },

      /**
       * Sets default options for all notifications.
       *
       * @method setOptions
       * @param {Object} options Notifications options
       * @param {String} [options.closeLabel] Notifications close button label
       * @param {String} [options.closeAriaLabel] Notifications close button ARIA label
       * @final
       */
      setOptions: {
        value: function(options) {
          if (options.closeLabel) self.options.closeLabel = options.closeLabel;
          if (options.closeAriaLabel) self.options.closeAriaLabel = options.closeAriaLabel;
        }
      },

      /**
       * Gets default options for all notifications.
       *
       * @method getOptions
       * @return {Object} Notifications default options
       * @final
       */
      getOptions: {
        value: function() {
          return self.options;
        }
      }
    });

    return {
      getOptions: this.getOptions,
      setOptions: this.setOptions
    };
  }

  app.factory('opaNotificationConfiguration', OpaNotificationConfiguration);
  OpaNotificationConfiguration.$inject = [];

})(angular.module('opa'));
