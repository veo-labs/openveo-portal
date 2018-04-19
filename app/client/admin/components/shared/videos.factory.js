'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages videos.
   *
   * @class OpaVideosFactory
   * @param {Object} $http AngularJS $http service
   * @param {String} opaWebServiceBasePath Portal web service base path
   */
  function OpaVideosFactory($http, opaWebServiceBasePath) {

    /**
     * Gets an OpenVeo video.
     *
     * @param {String} id The id of the video to retrieve
     * @return {HttpPromise} An AngularJS promise resolving with the video
     * @method getVideo
     */
    function getVideo(id) {
      return $http.get(opaWebServiceBasePath + 'videos/' + id);
    }

    /**
     * Gets promoted videos.
     *
     * @return {HttpPromise} An AngularJS promise resolving with an object containing the promoted videos
     * @method getPromotedVideos
     */
    function getPromotedVideos() {
      return $http.get(opaWebServiceBasePath + 'videos/promoted');
    }

    return {
      getVideo: getVideo,
      getPromotedVideos: getPromotedVideos
    };

  }

  app.factory('opaVideosFactory', OpaVideosFactory);
  OpaVideosFactory.$inject = ['$http', 'opaWebServiceBasePath'];

})(angular.module('opa'));
