'use strict';

/**
 * @module opa
 */

/**
 * Settings component presents a formular to configure the portal.
 *
 *     <opa-settings></opa-settings>
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaSettingsFactory** Factory to manage Portal settings
 * - **opaGroupsFactory** Factory to get OpenVeo groups
 * - **opaNotificationFactory** Factory to manage notifications
 * - **opaLiveSettings** Formular to configure OpenVeo Portal live
 * - **opaTranslate** Internationalization translate filter
 *
 * @class opaSettings
 */

(function(app) {

  app.component('opaSettings', {
    templateUrl: 'opa-settings.html',
    controller: 'OpaSettingsController',
    require: ['?^mdContent'],
    bindings: {}
  });

})(angular.module('opa'));
