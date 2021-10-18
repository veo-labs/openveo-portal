'use strict';

(function(app) {

  /**
   * Defines service to manage the video search.
   *
   * @class VideoService
   * @memberof module:ov
   * @inner
   */
  function VideoService($http, $cookies, webServiceBasePath) {

    /**
     * @return {HttpPromise}
     */
    function increaseVideoView(id, expires) {
      if ($cookies.get(id) || !expires) return;
      return $http.post(webServiceBasePath + 'statistics/video/views/' + id).then(function() {
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
  VideoService.$inject = ['$http', '$cookies', 'webServiceBasePath'];

})(angular.module('ov.portal'));
