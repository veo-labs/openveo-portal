'use strict';

/**
 * @module opa
 */

/**
 * Promoted videos component presents an editor to promote 9 videos.
 *
 * The editor is made of placeholders symbolizing front office promoted videos. Videos can be added from a
 * placeholder using a media library.
 *
 *     <opa-promoted-videos></opa-promoted-videos>
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaSettingsFactory** Factory to manage Portal settings
 * - **opaVideosFactory** Factory to manage videos
 * - **opaNotificationFactory** Notification factory to display saving notifications
 * - **opaUrlFactory** URL factory to manipulate URLs
 * - **opaTranslate** Internationalization translate filter
 * - **opaMediaContainer** Component to select a media from the media library
 *
 * @class opaPromotedVideos
 */

(function(app) {

  app.component('opaPromotedVideos', {
    templateUrl: 'opa-promotedVideos.html',
    controller: 'OpaPromotedVideosController',
    bindings: {}
  });

})(angular.module('opa'));
