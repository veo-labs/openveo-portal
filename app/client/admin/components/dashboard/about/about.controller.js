'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaAbout component.
   *
   * @class OpaAboutController
   * @constructor
   * @param {Object} $filter AngularJS $filter service
   * @param {Object} opaAboutFactory Factory to get information about OpenVeo Portal
   */
  function OpaAboutController($filter, opaAboutFactory) {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * Information about OpenVeo Portal.
       *
       * @property information
       * @type Object
       * @default {}
       */
      information: {
        value: {},
        writable: true
      },

      /**
       * About message which varies regarding project's information.
       *
       * @property message
       * @type String
       * @default ''
       */
      message: {
        value: '',
        writable: true
      },

      /**
       * Indicates if component is loaded and can be displayed.
       *
       * @property isLoaded
       * @type Boolean
       * @default false
       */
      isLoaded: {
        value: false,
        writable: true
      },

      /**
       * Initializes controller.
       *
       * @method $onInit
       * @final
       */
      $onInit: {
        value: function() {
          opaAboutFactory.getInfo().then(function(info) {
            ctrl.isLoaded = true;
            ctrl.information = info.data;

            // Prepare message regarding if an update is available or not
            ctrl.message = $filter('opaTranslate')(
              (ctrl.information.updateAvailable) ?
                'DASHBOARD.ABOUT.NEED_UPGRADE_DESCRIPTION' :
                'DASHBOARD.ABOUT.UP_TO_DATE_DESCRIPTION',
              0,
              {
                '%version%': ctrl.information.version,
                '%versionUrl%': ctrl.information.versionReleaseUrl,
                '%latestVersion%': ctrl.information.latestVersion,
                '%latestVersionUrl%': ctrl.information.latestVersionReleaseUrl
              }
            );

          }, function(error) {
            ctrl.isLoaded = true;
          });
        }
      }

    });
  }

  app.controller('OpaAboutController', OpaAboutController);
  OpaAboutController.$inject = ['$filter', 'opaAboutFactory'];

})(angular.module('opa'));
