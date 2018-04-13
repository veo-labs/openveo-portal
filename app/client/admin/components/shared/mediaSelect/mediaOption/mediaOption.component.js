'use strict';

/**
 * Media option component presents the thumbnail of a media with a checkbox to select it.
 *
 * <opa-media-option opa-checked="value"
 *                   opa-media="media"
 *                   opa-focus="focus">
 *                   opa-blur="blurCallback()"></opa-media-option>
 *
 * Available attributes are:
 * - [Boolean] **opa-checked**: The state of the checkbox
 * - [Object] **opa-media**: The media to represent
 * - [Boolean] **opa-focus**: Activate focus on the media
 * - [Function] **opa-blur**: Blur callback function
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
      opaMedia: '<',
      opaFocus: '<',
      opaBlur: '&'
    }
  });

})(angular.module('opa'));
