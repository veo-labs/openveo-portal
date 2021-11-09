'use strict';

(function(app) {

  /**
   * Manages opaSearchSettings component.
   *
   * @class OpaSearchSettingsController
   * @memberof module:opa/settings/searchSettings
   * @inner
   * @param {Object} $scope The component isolated scope
   * @constructor
   */
  function OpaSearchSettingsController($scope) {
    var ctrl = this;

    Object.defineProperties(ctrl,

      /** @lends module:opa/settings/searchSettings~OpaSearchSettingsController */
      {

        /**
         * Search settings.
         *
         * @type {Object}
         * @instance
         * @default null
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
         * @memberof module:opa/settings/searchSettings~OpaSearchSettingsController
         * @method $onChanges
         * @instance
         * @param {Object} changedProperties Properties which have changed since last digest loop
         * @param {Object} [changedProperties.opaSettings] opa-settings old and new value
         * @param {Boolean} [changedProperties.opaSettings.currentValue] opa-settings new value
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
         * @memberof module:opa/settings/searchSettings~OpaSearchSettingsController
         * @method $postLink
         * @instance
         */
        $postLink: {
          value: function() {
            $scope.$emit('opaSearchSettingsLinked', {controller: ctrl});
          }
        },

        /**
         * Executes opa-on-update function with settings if form is valid.
         *
         * @memberof module:opa/settings/searchSettings~OpaSearchSettingsController
         * @method callUpdate
         * @instance
         */
        callUpdate: {
          value: function() {

            // Differ to let AngularJs the time to validate the formular with the new values
            setTimeout(function() {
              if (ctrl.isValid() && ctrl.opaOnUpdate)
                ctrl.opaOnUpdate({settings: ctrl.settings});
            });

          }
        },

        /**
         * Tests if settings are valid.
         *
         * @memberof module:opa/settings/searchSettings~OpaSearchSettingsController
         * @method isValid
         * @instance
         * @return {Boolean} true if valid, false otherwise
         */
        isValid: {
          value: function() {
            return ($scope.opaSearchSettings) ? $scope.opaSearchSettings.$valid : true;
          }
        }

      }

    );

    // Execute opa-on-update function if settings change
    $scope.$watch('$ctrl.opaSettings', function(newValue, oldValue) {
      ctrl.callUpdate();
    }, true);
  }

  app.controller('OpaSearchSettingsController', OpaSearchSettingsController);
  OpaSearchSettingsController.$inject = ['$scope'];

})(angular.module('opa'));

