'use strict';

/**
 * @module opa
 */

/**
 * Live settings component presents a formular to configure OpenVeo Portal live.
 *
 *     <opa-live-settings></opa-live-settings>
 *
 * Available attributes are:
 *   - [Object] **[opa-settings]**: The live settings with:
 *     - [Boolean] **[activated]**: true if live is activated, false otherwise
 *     - [String] **[playerType]**: The type of live player, could be either "youtube" or "wowza"
 *     - [String] **[url]**: The live streeam url depending on "playerType"
 *     - [Boolean] **[private]**: true if access to the live must be restricted to some OpenVeo groups
 *     - [Array] **[groups]**: The list of OpenVeo groups which have access to the private live
 *   - [Object] **[opa-groups]**: The list of available groups
 *   - [Function] **[opa-on-update]**: Function to call when live settings have been modified
 *
 * @class opaLiveSettings
 */

(function(app) {

  app.component('opaLiveSettings', {
    templateUrl: 'opa-liveSettings.html',
    controller: 'OpaLiveSettingsController',
    bindings: {
      opaSettings: '<',
      opaGroups: '<',
      opaOnUpdate: '&'
    }
  });

})(angular.module('opa'));
