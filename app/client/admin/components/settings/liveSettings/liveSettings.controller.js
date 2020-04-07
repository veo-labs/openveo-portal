'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaLiveSettings component.
   *
   * @class OpaLiveSettingsController
   * @param {Object} $scope The component isolated scope
   * @constructor
   */
  function OpaLiveSettingsController($scope) {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * The list of available player types.
       *
       * @property availablePlayers
       * @type Array
       * @final
       */
      availablePlayers: {
        value: [
          {
            id: 'wowza',
            name: 'SETTINGS.LIVE.WOWZA'
          },
          {
            id: 'youtube',
            name: 'SETTINGS.LIVE.YOUTUBE'
          },
          {
            id: 'vodalys',
            name: 'SETTINGS.LIVE.VODALYS'
          }
        ]
      },

      /**
       * Message which indicates if live is activated or not.
       *
       * @property liveSwitchMessage
       * @type String
       */
      liveSwitchMessage: {
        value: null,
        writable: true
      },

      /**
       * Error message if url does not respect the player type format.
       *
       * @property urlErrorMessage
       * @type String
       */
      urlErrorMessage: {
        value: null,
        writable: true
      },

      /**
       * Live settings.
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
              activated: settings.activated === undefined ? false : settings.activated,
              playerType: settings.playerType || ctrl.availablePlayers[0].id,
              url: settings.url || null,
              wowza: settings.wowza || {},
              private: settings.private === undefined ? false : settings.private,
              groups: settings.groups || []
            };
            ctrl.settings.wowza.playerLicenseKey = (settings.wowza && settings.wowza.playerLicenseKey) || null;

            // Update live switch message
            ctrl.updateLiveSwitchMessage(ctrl.settings.activated);

            // Update live url error message
            ctrl.updateUrlErrorMessage(ctrl.settings.playerType);

            ctrl.callUpdate();
          }
        }
      },

      /**
       * Emits an 'opaLiveSettingsLinked' when component is linked.
       *
       * @method $postLink
       * @final
       */
      $postLink: {
        value: function() {
          $scope.$emit('opaLiveSettingsLinked', {controller: ctrl});
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
       * Updates the label of the switch element to activate / deactivate live.
       *
       * @method updateLiveSwitchMessage
       * @param {Boolean} isActivated true if activated, false otherwise
       * @final
       */
      updateLiveSwitchMessage: {
        value: function(isActivated) {
          ctrl.liveSwitchMessage = isActivated ? 'SETTINGS.LIVE.ACTIVATED_LABEL' : 'SETTINGS.LIVE.DEACTIVATED_LABEL';
        }
      },

      /**
       * Updates the url error message depending on player type.
       *
       * @method updateUrlErrorMessage
       * @param {String} playerType The player type (either "youtube", "wowza" or "vodalys")
       * @final
       */
      updateUrlErrorMessage: {
        value: function(playerType) {
          ctrl.urlErrorMessage = 'SETTINGS.LIVE.URL_' + playerType.toUpperCase() + '_ERROR';
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
          return ($scope.opaLiveSettings) ? $scope.opaLiveSettings.$valid : true;
        }
      }

    });

    // Execute opa-on-update function if settings change
    $scope.$watch('$ctrl.opaSettings', function(newValue, oldValue) {
      ctrl.callUpdate();
    }, true);
  }

  app.controller('OpaLiveSettingsController', OpaLiveSettingsController);
  OpaLiveSettingsController.$inject = ['$scope'];

})(angular.module('opa'));
