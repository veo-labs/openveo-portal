'use strict';

/**
 * Media select component provides a (multiple or single) media selection within a list of medias
 *
 * <opa-media-select ng-model="ngModel"
 *                   opa-medias="medias"
 *                   opa-multiple="selectionMultiple">
 * </opa-media-select>
 *
 * Available attributes are:
 * - [Mixed] **ng-model**: The selected medias, it can be an array when multiple selection is active,
 *                         or a single value (string) otherwise.
 * - [Array] **opa-medias**: The list of available medias
 * - [Boolean] **opa-multiple**: Enable multiple selection
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 *
 * @module opa
 * @class opaMediaSelect
 */

(function(app) {
  app.component('opaMediaSelect', {
    templateUrl: 'opa-mediaSelect.html',
    controller: 'OpaMediaSelectController',
    bindings: {
      ngModel: '=',
      opaMedias: '<',
      opaMultiple: '<'
    }
  });

})(angular.module('opa'));
