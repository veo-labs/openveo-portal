'use strict';

/**
 * Media container component provides a container where media can be put inside.
 *
 * <opa-media-container opa-title="{{ title }}"
 *                      opa-media="media"
 *                      opa-edit="editAction()"
 *                      opa-remove="removeAction()">
 * </opa-media-container>
 *
 * Available attributes are:
 * - [String] **opa-title**: The title of the container
 * - [Object] **opa-media**: The media to place in the container
 * - [Function] **opa-edit**: The callback to launch for select a media
 * - [Function] **opa-remove**: The callback to launch to clear the media
 *
 * Requires:
 * - **ngMaterial** AngularJS Materiel module
 *
 * @module opa
 * @class opaMediaSelect
 */
(function(app) {
  app.component('opaMediaContainer', {
    templateUrl: 'opa-mediaContainer.html',
    controller: 'OpaMediaContainerController',
    controllerAs: 'ctrl',
    bindings: {
      opaTitle: '@',
      opaMedia: '<',
      opaEdit: '&',
      opaRemove: '&'
    }
  });

})(angular.module('opa'));
