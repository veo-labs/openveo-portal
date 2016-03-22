'use strict';

(function(app) {

  /**
   * Defines service to manage the video search.
   *
   * @module ov
   * @class applicationService
   */
  function SearchService($http, $q) {
    var basePath = '/';
    var filters;
    var homeVideos;
    var videosCache = {};

    /**
     *
     * @param {type} id
     * @return {unresolved}
     */
    function loadVideo(id) {
      if (!videosCache[id] || videosCache[id].needAuth) {
        return $http.get(basePath + 'getvideo/' + id).success(function(obj) {
          videosCache[id] = obj;
        });
      }
      return $q.when({
        data: {entity: videosCache[id]}
      });
    }

    /**
     *
     * @return filters
     */
    function getFilters() {
      if (!filters) {
        return $http.get(basePath + 'filters').success(function(obj) {
          filters = obj;
        });
      }

      return $q.when({data: filters});
    }

    /**
     * Loads the list of videos for Homepage
     *
     * @return {Promise} The Http promise
     * @method loadScopes
     * @return data
     */
    function searchHomeVideos() {

      if (!homeVideos) {

        var params = {
          filter: {},
          pagination: {
            page: 0,
            limit: 6,
            orderBy: 'date',
            orderAsc: true
          }
        };
        return $http.post(basePath + 'search', params).success(function(obj) {
          homeVideos = obj;
        });
      }

      return $q.when({data: homeVideos});
    }

    /**
     *
     * @param {Object} params
     * @param {Object} paginate
     * @return data
     */
    function search(filter, paginate, canceller) {
      var options = {timeout: canceller};
      var params = {filter: filter, pagination: paginate};
      return $http.post(basePath + 'search', params, options);
    }

    /**
     * Clears a search service cache.
     *
     * @param {String} [type] The cache element to clear null to
     * clear all caches
     * @method cacheClear
     */
    function cacheClear() {
      videosCache = {};
    }

    return {
      cacheClear: cacheClear,
      loadVideo: loadVideo,
      getFilters: getFilters,
      searchHomeVideos: searchHomeVideos,
      search: search
    };

  }

  app.factory('searchService', SearchService);
  SearchService.$inject = ['$http', '$q'];

})(angular.module('ov.portal'));
