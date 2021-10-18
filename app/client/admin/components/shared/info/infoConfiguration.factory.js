'use strict';

(function(app) {

  /**
   * Manages opa-info default configuration.
   *
   * @class OpaInfoConfiguration
   * @memberof module:opa/info
   * @inner
   */
  function OpaInfoConfiguration() {
    var self = this;

    Object.defineProperties(this,

      /** @lends module:opa/info~OpaInfoConfiguration */
      {

        /**
         * The default options for the opa-info directives.
         *
         * @type {Object}
         * @instance
         * @readonly
         */
        options: {
          value: {}
        },

        /**
         * Sets default options for the opa-info directives.
         *
         * @memberof module:opa/info~OpaInfoConfiguration
         * @method setOptions
         * @instance
         * @param {Object} options opa-info directive options
         * @param {String} [options.closeLabel] opa-info close button label
         * @param {String} [options.closeAriaLabel] opa-info close button ARIA label
         */
        setOptions: {
          value: function(options) {
            if (options.closeLabel) self.options.closeLabel = options.closeLabel;
            if (options.closeAriaLabel) self.options.closeAriaLabel = options.closeAriaLabel;
          }
        },

        /**
         * Gets default options for the opa-info directives.
         *
         * @memberof module:opa/info~OpaInfoConfiguration
         * @method getOptions
         * @instance
         * @return {Object} opa-info directive default options
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

  app.factory('opaInfoConfiguration', OpaInfoConfiguration);
  OpaInfoConfiguration.$inject = [];

})(angular.module('opa'));
