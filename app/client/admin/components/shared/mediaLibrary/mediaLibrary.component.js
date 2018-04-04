'use strict';

/**
 * Media library component provides medias for media select component
 *
 * <opa-media-library ng-model="ngmodel"
 *                    opa-multiple="multiple"
 *                    opa-results-per-page="limit">
 * </opa-media-library>
 *
 * Available attributes are:
 * - [Mixed] **ng-model**: The selected medias, it can be an array when multiple selection is active,
 *                         or a single value (string) otherwise.
 * - [Boolean] **opa-multiple**: Enable multiple selection
 *
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 *
 * @module opa
 * @class opaMediaLibrary
 */

(function(app) {
  app.component('opaMediaLibrary', {
    templateUrl: 'opa-mediaLibrary.html',
    controller: 'OpaMediaLibraryController',
    bindings: {
      opaMultiple: '<',
      opaResultsPerPage: '<',
      ngModel: '='
    }
  });

})(angular.module('opa'));
