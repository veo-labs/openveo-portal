'use strict';

(function(app) {

  /**
   * Manages videos.
   *
   * @class OpaVideosFactory
   * @memberof module:opa
   * @inner
   * @param {Object} $http AngularJS $http service
   * @param {String} opaWebServiceBasePath Portal web service base path
   */
  function OpaVideosFactory($http, opaWebServiceBasePath) {

    /**
     * Gets an OpenVeo video.
     *
     * @memberof module:opa~OpaVideosFactory
     * @instance
     * @param {String} id The id of the video to retrieve
     * @return {HttpPromise} An AngularJS promise resolving with the video
     */
    function getVideo(id) {
      return $http.get(opaWebServiceBasePath + 'videos/' + id);
    }

    /**
     * Gets promoted videos.
     *
     * @memberof module:opa~OpaVideosFactory
     * @instance
     * @return {HttpPromise} An AngularJS promise resolving with an object containing the promoted videos
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
