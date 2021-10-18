'use strict';

(function(app) {

  /**
   * Manages opaLicenseKeyValidator directive.
   *
   * @class OpaLicenseKeyValidatorController
   * @memberof module:opa/licenseKeyValidator
   * @inner
   * @constructor
   * @param {Object} $element JQLite element of the directive
   */
  function OpaLicenseKeyValidatorController($element) {
    var ctrl = this;
    var ngModelController = $element.controller('ngModel');

    Object.defineProperties(this,

      /** @lends module:opa/licenseKeyValidator~OpaLicenseKeyValidatorController */
      {

        /**
         * Validates that the given value is a license key.
         *
         * Expected format only allows series of 5 characters separated by dashes.
         * Only alphanumeric characters are allowed between dashes.
         * e.g. PLAY1-cerPw-zxezN-eMvje-9jHAD-8xA3j
         *
         * @memberof module:opa/licenseKeyValidator~OpaLicenseKeyValidatorController
         * @method isValid
         * @instance
         * @param {String} value The license key to validate
         * @return {Boolean} true if valid, false otherwise
         */
        isValid: {
          value: function(value) {
            return /^([a-zA-Z0-9]{5}-)*[a-zA-Z0-9]{5}$/.test(value);
          }
        },

        /**
         * Handles one-way binding properties changes and force model validation.
         *
         * @memberof module:opa/licenseKeyValidator~OpaLicenseKeyValidatorController
         * @method $onChanges
         * @instance
         */
        $onChanges: {
          value: function() {
            ngModelController.$validate();
          }
        }

      }

    );

    // Add the "opaLicenseKey" validator to the model
    ngModelController.$validators.opaLicenseKey = function(modelValue, viewValue) {
      if (!modelValue) return true;
      if (!ctrl.opaLicenseKeyValidator) return true;
      return ctrl.isValid(modelValue);
    };
  }

  app.controller('OpaLicenseKeyValidatorController', OpaLicenseKeyValidatorController);
  OpaLicenseKeyValidatorController.$inject = ['$element'];

})(angular.module('opa'));
