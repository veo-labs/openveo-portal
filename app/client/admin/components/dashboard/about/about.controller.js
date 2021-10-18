'use strict';

(function(app) {

  /**
   * Manages opaAbout component.
   *
   * @class OpaAboutController
   * @memberof module:opa/dashboard/about
   * @inner
   * @constructor
   * @param {Object} $filter AngularJS $filter service
   * @param {Object} opaAboutFactory Factory to get information about OpenVeo Portal
   */
  function OpaAboutController($filter, opaAboutFactory) {
    var ctrl = this;

    Object.defineProperties(ctrl,

      /** @lends module:opa/dashboard/about~OpaAboutController */
      {

        /**
         * Information about OpenVeo Portal.
         *
         * @type {Object}
         * @instance
         */
        information: {
          value: {},
          writable: true
        },

        /**
         * About message which varies regarding project's information.
         *
         * @type {String}
         * @instance
         * @default ''
         */
        message: {
          value: '',
          writable: true
        },

        /**
         * Indicates if component is loaded and can be displayed.
         *
         * @type {Boolean}
         * @instance
         * @default false
         */
        isLoaded: {
          value: false,
          writable: true
        },

        /**
         * Initializes controller.
         *
         * @memberof module:opa/dashboard/about~OpaAboutController
         * @method $onInit
         * @instance
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

      }

    );
  }

  app.controller('OpaAboutController', OpaAboutController);
  OpaAboutController.$inject = ['$filter', 'opaAboutFactory'];

})(angular.module('opa'));
