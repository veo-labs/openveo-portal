'use strict';

/**
 * Media option component presents the thumbnail of a media with a checkbox to select it.
 *
 * <opa-media-option ng-model="ngModel" opa-media="media"></opa-media-option>
 *
 * Available attributes are:
 * - [Boolean] **ng-model**: The state of the checkbox
 * - [Object] **opa-media**: The media to represent
 *
 * Requires
 * - **ngMaterial** AngularJS Material module
 * - **opaMediaSelect** OpenVeo Media select component
 *
 * @module opa
 * @class opaMediaOption
 */

(function(app) {

  app.component('opaMediaOption', {
    templateUrl: 'opa-mediaOption.html',
    controller: 'OpaMediaOptionController',

    // md-truncate overrides $ctrl
    controllerAs: 'ctrl',
    require: {
      selectCtrl: '^opaMediaSelect'
    },
    bindings: {
      opaChecked: '<',
      opaMedia: '<'
    }
  });

})(angular.module('opa'));
