'use strict';

/**
 * @module opa
 */

/**
 * Settings component presents a formular to configure the portal.
 *
 *     <opa-settings></opa-settings>
 *
 * @class opaSettings
 */

(function(app) {

  app.component('opaSettings', {
    templateUrl: 'opa-settings.html',
    controller: 'OpaSettingsController',
    bindings: {}
  });

})(angular.module('opa'));
