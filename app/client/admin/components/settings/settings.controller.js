'use strict';

(function(app) {

  /**
   * Manages opaSettings component.
   *
   * @class OpaSettingsController
   * @memberof module:opa/settings
   * @inner
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
    var searchSettingsController;
    var mdContentController = $element.controller && $element.controller('mdContent');

    Object.defineProperties(ctrl,

      /** @lends module:opa/settings~OpaSettingsController */
      {

        /**
         * Indicates if retreiving the settings failed.
         *
         * @type {Boolean}
         * @instance
         * @default false
         */
        isError: {
          value: false,
          writable: true
        },

        /**
         * The list of OpenVeo groups with name and value.
         *
         * @type {Array}
         * @instance
         * @readonly
         */
        availableGroups: {
          value: []
        },

        /**
         * Live settings.
         *
         * @type {Object}
         * @instance
         * @default null
         */
        liveSettings: {
          value: null,
          writable: true
        },

        /**
         * Search settings.
         *
         * @type {Object}
         * @instance
         * @default null
         */
        searchSettings: {
          value: null,
          writable: true
        },

        /**
         * Initializes controller and informs when component is loaded.
         *
         * @memberof module:opa/settings~OpaSettingsController
         * @method $onInit
         * @instance
         */
        $onInit: {
          value: function() {
            $q.all([
              opaSettingsFactory.getSetting('live'),
              opaSettingsFactory.getSetting('search'),
              opaGroupsFactory.getGroups()
            ]).then(function(results) {
              var groups = results[2].data && results[2].data.entities;
              ctrl.liveSettings = results[0].data && results[0].data.entity && results[0].data.entity.value || {};
              ctrl.searchSettings = results[1].data && results[1].data.entity && results[1].data.entity.value || {};

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

            $scope.$on('opaSearchSettingsLinked', function(event, data) {
              searchSettingsController = data.controller;
            });

            // If the component is inside an md-content element the only way to have a background color
            // which spread all along the height of the md-content is to set the background color
            // on the md-content itself. This is due to flexbox behaviour when having a flex container with
            // stretch items, if items haven't an intrinsic height they shrink. As we want the child to
            // stretch to an indeterminated height (the height of the container) it is not possible to specify
            // the child height. A way to solve the problem will be to use experimental features such as
            // "width: fit-content;". Instead we add a class on the md-content parent element.
            if (mdContentController)
              mdContentController.$element.addClass('opa-settings-wrapper');
          }

        },

        /**
         * Saves current settings.
         *
         * @memberof module:opa/settings~OpaSettingsController
         * @method save
         * @instance
         */
        save: {
          value: function() {
            ctrl.isSaving = true;

            $q.all([
              opaSettingsFactory.updateSetting('live', ctrl.liveSettings),
              opaSettingsFactory.updateSetting('search', ctrl.searchSettings)
            ]).then(function() {
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
         * @memberof module:opa/settings~OpaSettingsController
         * @method updateLiveSettings
         * @param {Object} settings Live settings
         * @param {Boolean} settings.activated true if live is activated, false otherwise
         * @param {String} settings.playerType Either "youtube", "wowza" or "vodalys"
         * @param {String} settings.url Live stream URL
         * @param {Boolean} settings.private true if live is private, false otherwise
         * @param {Array} settings.groups The list of groups allowed to access the live
         * @instance
         */
        updateLiveSettings: {
          value: function(settings) {
            if (!settings || !ctrl.liveSettings) return;
            ctrl.liveSettings.activated = settings.activated;
            ctrl.liveSettings.playerType = settings.playerType;
            ctrl.liveSettings.url = settings.url;
            ctrl.liveSettings.private = settings.private;
            ctrl.liveSettings.groups = settings.groups;
          }
        },

        /**
         * Updates search settings.
         *
         * @memberof module:opa/settings~OpaSettingsController
         * @method updateSearchSettings
         * @param {Object} settings Search settings
         * @param {Boolean} settings.pois true if search must be performed also in points of interest, false otherwise
         * @instance
         */
        updateSearchSettings: {
          value: function(settings) {
            if (!settings || !ctrl.searchSettings) return;
            ctrl.searchSettings.pois = settings.pois;
          }
        },

        /**
         * Tests if settings are valid.
         *
         * @memberof module:opa/settings~OpaSettingsController
         * @method isValid
         * @instance
         * @return {Boolean} true if valid, false otherwise
         */
        isValid: {
          value: function() {
            if (liveSettingsController && searchSettingsController) {
              return liveSettingsController.isValid() && searchSettingsController.isValid();
            }
            return false;
          }
        }

      }

    );
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
