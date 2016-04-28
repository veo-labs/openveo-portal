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
    var categories;
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
          videosCache[id] = obj.entity;
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
     *
     * @return categories
     */
    function getCategories() {
      if (!categories) {
        return $http.get(basePath + 'categories').success(function(obj) {
          categories = obj;
        });
      }

      return $q.when({data: categories});
    }

    /**
     *
     * @return categories
     */
    function getCategoryName(id) {
      var self = this;
      return self.getCategories().then(function(result) {
        return result.data.values[id];
      });
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
          filter: {
            sortBy: 'date',
            sortOrder: 'asc'
          },
          pagination: {
            page: 0,
            limit: 6
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
      var options = {};
      if (canceller)
        options['timeout'] = canceller;
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
      filters = {};
      categories = {};
      homeVideos = {};
    }

    return {
      cacheClear: cacheClear,
      loadVideo: loadVideo,
      getFilters: getFilters,
      getCategories: getCategories,
      getCategoryName: getCategoryName,
      searchHomeVideos: searchHomeVideos,
      search: search
    };

  }

  app.factory('searchService', SearchService);
  SearchService.$inject = ['$http', '$q'];

})(angular.module('ov.portal'));
