'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaSearchSettings component.
   *
   * @class OpaSearchSettingsController
   * @param {Object} $scope The component isolated scope
   * @constructor
   */
  function OpaSearchSettingsController($scope) {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * Search settings.
       *
       * @property settings
       * @type Object
       */
      settings: {
        value: null,
        writable: true
      },

      /**
       * Handles one-way binding properties changes.
       *
       * Validate settings and set default values.
       *
       * @method $onChanges
       * @param {Object} changedProperties Properties which have changed since last digest loop
       * @param {Object} [changedProperties.opaSettings] opa-settings old and new value
       * @param {Boolean} [changedProperties.opaSettings.currentValue] opa-settings new value
       * @final
       */
      $onChanges: {
        value: function(changedProperties) {
          if (changedProperties.opaSettings && changedProperties.opaSettings.currentValue) {
            var settings = angular.copy(changedProperties.opaSettings.currentValue);

            ctrl.settings = {
              pois: settings.pois === undefined ? false : settings.pois
            };

            ctrl.callUpdate();
          }
        }
      },

      /**
       * Emits an 'opaSearchSettingsLinked' when component is linked.
       *
       * @method $postLink
       * @final
       */
      $postLink: {
        value: function() {
          $scope.$emit('opaSearchSettingsLinked', {controller: ctrl});
        }
      },

      /**
       * Executes opa-on-update function with settings if form is valid.
       *
       * @method callUpdate
       * @final
       */
      callUpdate: {
        value: function() {
          if (ctrl.isValid() && ctrl.opaOnUpdate)
            ctrl.opaOnUpdate({settings: ctrl.settings});
        }
      },

      /**
       * Tests if settings are valid.
       *
       * @method isValid
       * @return {Boolean} true if valid, false otherwise
       * @final
       */
      isValid: {
        value: function() {
          return ($scope.opaSearchSettings) ? $scope.opaSearchSettings.$valid : true;
        }
      }

    });

    // Execute opa-on-update function if settings change
    $scope.$watch('$ctrl.opaSettings', function(newValue, oldValue) {
      ctrl.callUpdate();
    }, true);
  }

  app.controller('OpaSearchSettingsController', OpaSearchSettingsController);
  OpaSearchSettingsController.$inject = ['$scope'];

})(angular.module('opa'));

