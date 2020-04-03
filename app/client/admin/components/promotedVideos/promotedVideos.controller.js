'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaPromotedVideos component.
   *
   * @class OpaPromotedVideosController
   * @constructor
   * @param {Object} $scope The component isolated scope
   * @param {Object} $filter AngularJS $filter service
   * @param {Object} $mdDialog AngularJS Material dialog service to open the media library
   * @param {Object} $mdMedia AngularJS Material media service to perform media queries
   * @param {Object} opaSettingsFactory Settings factory to get / save settings
   * @param {Object} opaVideosFactory Videos factory to get videos
   * @param {Object} opaNotificationFactory Notification factory to display saving notifications
   * @param {Object} opaUrlFactory URL factory to manipulate URLs
   */
  function OpaPromotedVideosController(
    $scope,
    $filter,
    $mdDialog,
    $mdMedia,
    opaSettingsFactory,
    opaVideosFactory,
    opaNotificationFactory,
    opaUrlFactory
  ) {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * Indicates if retreiving the promoted videos failed.
       *
       * @property isError
       * @type Boolean
       * @final
       */
      isError: {
        value: false,
        writable: true
      },

      /**
       * Indicates if currently saving.
       *
       * @property isSaving
       * @type Boolean
       * @final
       */
      isSaving: {
        value: false,
        writable: true
      },

      /**
       * Promoted videos settings.
       *
       * @property promotedVideos
       * @type Object
       * @final
       */
      promotedVideos: {
        value: null,
        writable: true
      },

      /**
       * The list of video containers.
       *
       * @property containers
       * @type Array
       */
      containers: {
        value: [],
        writable: true
      },

      /**
       * CSS class of the media containers components.
       *
       * @property containersClass
       * @type String
       */
      containersClass: {
        value: '',
        writable: true
      },

      /**
       * Initializes controller and informs when component is loaded.
       *
       * @method $onInit
       * @final
       */
      $onInit: {
        value: function() {
          opaVideosFactory.getPromotedVideos().then(function(result) {
            ctrl.promotedVideos = result.data && result.data || new Array(9);

            for (var i = 0; i < ctrl.promotedVideos.length; i++) {
              var style = i === 0 ? 'publish-16by9-300' : 'publish-16by9-142';

              if (ctrl.promotedVideos[i]) {
                ctrl.promotedVideos[i].preview = opaUrlFactory.setUrlParameter(
                  ctrl.promotedVideos[i].thumbnail,
                  'style',
                  style
                );
              }

              ctrl.containers[i] = {
                title: i + 1,
                style: style,
                media: ctrl.promotedVideos[i]
              };
            }

            $scope.$emit('opaViewLoaded');
          }, function(error) {
            ctrl.isError = true;
            $scope.$emit('opaViewLoaded');
          });
        }
      },

      /**
       * Loads containers template depending on the media.
       *
       * @method getContainersTemplate
       * @final
       */
      getContainersTemplate: {
        value: function() {
          var template;

          if ($mdMedia('xs')) {
            ctrl.containersClass = 'opa-xs';
            template = 'opa-promotedVideos-containers-2And4Cols.html';
          } else if ($mdMedia('sm')) {
            ctrl.containersClass = 'opa-sm';
            template = 'opa-promotedVideos-containers-3Cols.html';
          } else {
            ctrl.containersClass = 'opa-gt-sm';
            template = 'opa-promotedVideos-containers-2And4Cols.html';
          }
          return template;
        }
      },

      /**
       * Opens media library when click event is triggered on a video container.
       *
       * @method openMediaLibraryDialog
       * @final
       */
      openMediaLibraryDialog: {
        value: function(index) {
          var container = ctrl.containers[index];
          $mdDialog.show({
            controller: 'OpaMediaLibraryDialogController',
            controllerAs: '$ctrl',
            templateUrl: 'opa-mediaLibraryDialog.html',
            locals: {
              value: container.media ? container.media.id : undefined,
              multiple: false
            }
          }).then(
            function(response) {
              var mediaId = response.value;

              if (!mediaId) {
                container.media = undefined;
                return;
              }

              opaVideosFactory.getVideo(mediaId).then(function(response) {
                container.media = response.data.entity;
                container.media.preview = opaUrlFactory.setUrlParameter(
                  response.data.entity.thumbnail,
                  'style',
                  container.style
                );
              });
            },
            function() {
            }
          );
        }
      },

      /**
       * Removes video from a container.
       *
       * @method clearContainer
       * @final
       */
      clearContainer: {
        value: function(index) {
          ctrl.containers[index].media = undefined;
        }
      },

      /**
       * Saves promoted videos.
       *
       * @method save
       * @final
       */
      save: {
        value: function() {
          ctrl.isSaving = true;
          var promotedVideos = new Array(9);

          for (var i = 0; i < promotedVideos.length; i++)
            promotedVideos[i] = (ctrl.containers[i].media && ctrl.containers[i].media.id) || undefined;

          opaSettingsFactory.updateSetting('promoted-videos', promotedVideos).then(function() {
            ctrl.isSaving = false;
            opaNotificationFactory.displayNotification($filter('opaTranslate')('PROMOTED_VIDEOS.SAVE_SUCCESS'), 1000);
          }, function(error) {
            ctrl.isSaving = false;
          });
        }
      }

    });
  }

  app.controller('OpaPromotedVideosController', OpaPromotedVideosController);
  OpaPromotedVideosController.$inject = [
    '$scope',
    '$filter',
    '$mdDialog',
    '$mdMedia',
    'opaSettingsFactory',
    'opaVideosFactory',
    'opaNotificationFactory',
    'opaUrlFactory'
  ];

})(angular.module('opa'));
