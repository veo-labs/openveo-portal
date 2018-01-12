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
            var settings = changedProperties.opaSettings.currentValue;
            ctrl.opaSettings.activated = settings.activated === undefined ? false : settings.activated;
            ctrl.opaSettings.playerType = settings.playerType || ctrl.availablePlayers[0].id;
            ctrl.opaSettings.url = settings.url || null;
            ctrl.opaSettings.wowza = settings.wowza || {};
            ctrl.opaSettings.wowza.playerLicenseKey = (settings.wowza && settings.wowza.playerLicenseKey) || null;
            ctrl.opaSettings.private = settings.private === undefined ? false : settings.private;
            ctrl.opaSettings.groups = settings.groups || [];

            // Update live switch message
            ctrl.updateLiveSwitchMessage(ctrl.opaSettings.activated);

            // Update live url error message
            ctrl.updateUrlErrorMessage(ctrl.opaSettings.playerType);

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
            ctrl.opaOnUpdate({settings: ctrl.opaSettings});
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
       * @param {String} playerType The player type (either "youtube" or "wowza")
       * @final
       */
      updateUrlErrorMessage: {
        value: function(playerType) {
          ctrl.urlErrorMessage =
          (playerType === 'youtube') ? 'SETTINGS.LIVE.URL_YOUTUBE_ERROR' : 'SETTINGS.LIVE.URL_WOWZA_ERROR';
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
