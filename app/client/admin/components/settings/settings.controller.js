'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaSettings component.
   *
   * @class OpaSettingsController
   * @constructor
   * @param {Object} $scope The component isolated scope
   * @param {Object} $q AngularJS $q service
   * @param {Object} $filter AngularJS $filter service
   * @param {Object} $element The HTML element holding the component
   * @param {Object} opaSettingsFactory Settings factory to get / save settings
   * @param {Object} opaGroupsFactory Groups factory to get available groups
   * @param {Object} opaNotificationFactory Notification factory to display saving notifications
   */
  function OpaSettingsController(
    $scope,
    $q,
    $filter,
    $element,
    opaSettingsFactory,
    opaGroupsFactory,
    opaNotificationFactory
  ) {
    var ctrl = this;
    var liveSettingsController;

    Object.defineProperties(ctrl, {

      /**
       * Indicates if retreiving the settings failed.
       *
       * @property isError
       * @type Boolean
       * @final
       */
      isError: {
        value: false,
        writable: true
      },

      /**
       * The list of OpenVeo groups with name and value.
       *
       * @property availableGroups
       * @type Array
       * @final
       */
      availableGroups: {
        value: []
      },

      /**
       * Live settings.
       *
       * @property liveSettings
       * @type Object
       * @final
       */
      liveSettings: {
        value: {},
        writable: true
      },

      /**
       * Initializes controller and informs when component is loaded.
       *
       * @method $onInit
       * @final
       */
      $onInit: {
        value: function() {
          $q.all([
            opaSettingsFactory.getSetting('live'),
            opaGroupsFactory.getGroups()
          ]).then(function(results) {
            var groups = results[1].data && results[1].data.entities;
            ctrl.liveSettings = results[0].data && results[0].data.entity && results[0].data.entity.value;

            // Build the list of available groups
            if (groups) {
              groups.forEach(function(group) {
                ctrl.availableGroups.push({
                  name: group.name,
                  value: group.id
                });
              });
            }

            $scope.$emit('opaViewLoaded');
          }, function(error) {
            ctrl.isError = true;
            $scope.$emit('opaViewLoaded');
          });

          $scope.$on('opaLiveSettingsLinked', function(event, data) {
            liveSettingsController = data.controller;
          });
        }

      },

      /**
       * Saves current settings.
       *
       * @method save
       * @final
       */
      save: {
        value: function() {
          ctrl.isSaving = true;

          opaSettingsFactory.updateSetting('live', ctrl.liveSettings).then(function() {
            ctrl.isSaving = false;
            opaNotificationFactory.displayNotification($filter('opaTranslate')('SETTINGS.SAVE_SUCCESS'), 1000);
          }, function(error) {
            ctrl.isSaving = false;
          });
        }
      },

      /**
       * Updates live settings.
       *
       * @method updateLiveSettings
       * @param {Object} settings Live settings
       * @param {Boolean} settings.activated true if live is activated, false otherwise
       * @param {String} settings.playerType Either "youtube" or "wowza"
       * @param {String} settings.url Live stream URL
       * @param {Boolean} settings.private true if live is private, false otherwise
       * @param {Array} settings.groups The list of groups allowed to access the live
       * @param {Object} settings.wowza Wowza specific settings
       * @final
       */
      updateLiveSettings: {
        value: function(settings) {
          if (!ctrl.liveSettings) return;
          ctrl.liveSettings.activated = settings.activated;
          ctrl.liveSettings.playerType = settings.playerType;
          ctrl.liveSettings.url = settings.url;
          ctrl.liveSettings.private = settings.private;
          ctrl.liveSettings.groups = settings.groups;
          ctrl.liveSettings.wowza = settings.wowza;
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
          if (liveSettingsController) {
            return liveSettingsController.isValid();
          }
          return false;
        }
      }

    });
  }

  app.controller('OpaSettingsController', OpaSettingsController);
  OpaSettingsController.$inject = [
    '$scope',
    '$q',
    '$filter',
    '$element',
    'opaSettingsFactory',
    'opaGroupsFactory',
    'opaNotificationFactory'
  ];

})(angular.module('opa'));
