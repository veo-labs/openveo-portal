'use strict';

(function(app) {

  /**
   * Manages opaLiveSettings component.
   *
   * @class OpaLiveSettingsController
   * @memberof module:opa/settings/liveSettings
   * @inner
   * @param {Object} $scope The component isolated scope
   * @constructor
   */
  function OpaLiveSettingsController($scope) {
    var ctrl = this;

    Object.defineProperties(ctrl,

      /** @lends module:opa/settings/liveSettings~OpaLiveSettingsController */
      {

        /**
         * The list of available player types.
         *
         * @type {Array}
         * @instance
         * @readonly
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
              id: 'vimeo',
              name: 'SETTINGS.LIVE.VIMEO'
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
         * @type {String}
         * @instance
         * @default null
         */
        liveSwitchMessage: {
          value: null,
          writable: true
        },

        /**
         * Error message if url does not respect the player type format.
         *
         * @type {String}
         * @instance
         * @default null
         */
        urlErrorMessage: {
          value: null,
          writable: true
        },

        /**
         * Live settings.
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
         * @memberof module:opa/settings/liveSettings~OpaLiveSettingsController
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
                activated: settings.activated === undefined ? false : settings.activated,
                playerType: settings.playerType || ctrl.availablePlayers[0].id,
                url: settings.url || null,
                private: settings.private === undefined ? false : settings.private,
                groups: settings.groups || []
              };

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
         * @memberof module:opa/settings/liveSettings~OpaLiveSettingsController
         * @method $postLink
         * @instance
         */
        $postLink: {
          value: function() {
            $scope.$emit('opaLiveSettingsLinked', {controller: ctrl});
          }
        },

        /**
         * Executes opa-on-update function with settings if form is valid.
         *
         * @memberof module:opa/settings/liveSettings~OpaLiveSettingsController
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
         * Updates the label of the switch element to activate / deactivate live.
         *
         * @memberof module:opa/settings/liveSettings~OpaLiveSettingsController
         * @method updateLiveSwitchMessage
         * @instance
         * @param {Boolean} isActivated true if activated, false otherwise
         */
        updateLiveSwitchMessage: {
          value: function(isActivated) {
            ctrl.liveSwitchMessage = isActivated ? 'SETTINGS.LIVE.ACTIVATED_LABEL' : 'SETTINGS.LIVE.DEACTIVATED_LABEL';
          }
        },

        /**
         * Updates the url error message depending on player type.
         *
         * @memberof module:opa/settings/liveSettings~OpaLiveSettingsController
         * @method updateUrlErrorMessage
         * @instance
         * @param {String} playerType The player type (either "youtube", "wowza" or "vodalys")
         */
        updateUrlErrorMessage: {
          value: function(playerType) {
            ctrl.urlErrorMessage = 'SETTINGS.LIVE.URL_' + playerType.toUpperCase() + '_ERROR';
          }
        },

        /**
         * Tests if settings are valid.
         *
         * @memberof module:opa/settings/liveSettings~OpaLiveSettingsController
         * @instance
         * @return {Boolean} true if valid, false otherwise
         */
        isValid: {
          value: function() {
            return ($scope.opaLiveSettings) ? $scope.opaLiveSettings.$valid : true;
          }
        }

      }

    );

    // Execute opa-on-update function if settings change
    $scope.$watch('$ctrl.opaSettings', function(newValue, oldValue) {
      ctrl.callUpdate();
    }, true);
  }

  app.controller('OpaLiveSettingsController', OpaLiveSettingsController);
  OpaLiveSettingsController.$inject = ['$scope'];

})(angular.module('opa'));
