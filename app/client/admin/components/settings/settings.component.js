'use strict';

/**
 * Settings component presents a formular to configure the portal.
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaSettingsFactory** Factory to manage Portal settings
 * - **opaGroupsFactory** Factory to get OpenVeo groups
 * - **opaNotificationFactory** Factory to manage notifications
 * - **opaLiveSettings** Formular to configure OpenVeo Portal live
 * - **opaTranslate** Internationalization translate filter
 *
 * @example
 * <opa-settings></opa-settings>
 *
 * @module opa/settings
 */

(function(app) {

  app.component('opaSettings', {
    templateUrl: 'opa-settings.html',
    controller: 'OpaSettingsController',
    require: ['?^mdContent'],
    bindings: {}
  });

})(angular.module('opa'));
