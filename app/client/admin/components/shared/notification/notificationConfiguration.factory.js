'use strict';

(function(app) {

  /**
   * Manages OPA notifications default configuration.
   *
   * @class OpaNotificationConfiguration
   * @memberof module:opa/notification
   * @inner
   */
  function OpaNotificationConfiguration() {
    var self = this;

    Object.defineProperties(this,

      /** @lends module:opa/notification~OpaNotificationConfiguration */
      {

        /**
         * The default options for all notifications.
         *
         * @type {Object}
         * @instance
         * @readonly
         */
        options: {
          value: {}
        },

        /**
         * Sets default options for all notifications.
         *
         * @memberof module:opa/notification~OpaNotificationConfiguration
         * @method setOptions
         * @instance
         * @param {Object} options Notifications options
         * @param {String} [options.closeLabel] Notifications close button label
         * @param {String} [options.closeAriaLabel] Notifications close button ARIA label
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
         * @memberof module:opa/notification~OpaNotificationConfiguration
         * @method getOptions
         * @instance
         * @return {Object} Notifications default options
         */
        getOptions: {
          value: function() {
            return self.options;
          }
        }
      }

    );

    return {
      getOptions: this.getOptions,
      setOptions: this.setOptions
    };
  }

  app.factory('opaNotificationConfiguration', OpaNotificationConfiguration);
  OpaNotificationConfiguration.$inject = [];

})(angular.module('opa'));
