'use strict';

(function(app) {

  /**
   * Defines service to manage the video search.
   *
   * @module ov
   * @class applicationService
   */
  function VideoService($http, $cookies) {

    var basePath = '/';

    /**
     *
     * @return filters
     */
    function increaseVideoView(id, expires) {
      if ($cookies.get(id) || !expires) return;
      return $http.post(basePath + 'statistics/video/views/' + id).success(function() {
        var now = new Date();
        var dateExpires = new Date(now.getTime() + expires);
        $cookies.put(id, true, {expires: dateExpires});
      });
    }

    return {
      increaseVideoView: increaseVideoView
    };

  }

  app.factory('videoService', VideoService);
  VideoService.$inject = ['$http', '$cookies'];

})(angular.module('ov.portal'));
