'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opa-info default configuration.
   *
   * @class opaInfoConfiguration
   */
  function OpaInfoConfiguration() {
    var self = this;

    Object.defineProperties(this, {

      /**
       * The default options for the opa-info directives.
       *
       * @property options
       * @type Object
       * @final
       */
      options: {
        value: {}
      },

      /**
       * Sets default options for the opa-info directives.
       *
       * @method setOptions
       * @param {Object} options opa-info directive options
       * @param {String} [options.closeLabel] opa-info close button label
       * @param {String} [options.closeAriaLabel] opa-info close button ARIA label
       * @final
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
       * @method getOptions
       * @return {Object} opa-info directive default options
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

  app.factory('opaInfoConfiguration', OpaInfoConfiguration);
  OpaInfoConfiguration.$inject = [];

})(angular.module('opa'));
