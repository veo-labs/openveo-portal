'use strict';

(function(app) {

  /**
   * Defines service to manage the video search.
   *
   * @memberof module:ov
   * @inner
   * @class SearchService
   */
  function SearchService($http, $q, webServiceBasePath) {
    var filters;
    var categories;
    var promotedVideos;
    var videosCache = {};

    /**
     * @memberof module:ov~SearchService
     * @instance
     * @param {String} id
     * @return {HttpPromise}
     */
    function loadVideo(id) {
      if (!videosCache[id] || videosCache[id].needAuth) {
        return $http.get(webServiceBasePath + 'videos/' + id).then(function(response) {
          videosCache[id] = response.data.entity;
          return response;
        });
      }
      return $q.when({
        data: {entity: videosCache[id]}
      });
    }

    /**
     * @memberof module:ov~SearchService
     * @instance
     * @return {HttpPromise}
     */
    function getFilters() {
      if (!filters || !Object.keys(filters).length) {
        return $http.get(webServiceBasePath + 'filters').then(function(response) {
          filters = response.data;
          return response;
        });
      }

      return $q.when({data: filters});
    }


    /**
     * @memberof module:ov~SearchService
     * @instance
     * @return {HttpPromise}
     */
    function getCategories() {
      if (!categories || !Object.keys(categories).length) {
        return $http.get(webServiceBasePath + 'categories').then(function(response) {
          categories = response.data;
          return response;
        });
      }

      return $q.when({data: categories});
    }

    /**
     * Gets a category name by its id.
     *
     * @memberof module:ov~SearchService
     * @instance
     * @param {String} id The category id
     * @return {HttpPromise} A promise resolving with the category name
     */
    function getCategoryName(id) {
      var self = this;

      if (!id) return $q.reject(new Error('Category id not defined'));

      return self.getCategories().then(function(result) {
        return result.data[id];
      });
    }

    /**
     * Gets the list of promoted videos.
     *
     * @memberof module:ov~SearchService
     * @instance
     * @return {Promise} A promise resolving with the list of promoted videos
     */
    function getPromotedVideos() {
      if (!promotedVideos || !Object.keys(promotedVideos).length) {
        return $http.get(webServiceBasePath + 'videos/promoted', {
          params: {
            auto: true
          }
        }).then(function(response) {
          promotedVideos = response.data;
          return response;
        });
      }

      return $q.when({data: promotedVideos});
    }

    /**
     * @memberof module:ov~SearchService
     * @instance
     * @param {Object} params
     * @param {Object} paginate
     * @return {HttpPromise}
     */
    function search(filter, paginate, canceller) {
      var options = {};
      if (canceller)
        options['timeout'] = canceller;
      var params = {filter: filter, pagination: paginate};
      return $http.post(webServiceBasePath + 'videos', params, options);
    }

    /**
     * Clears a search service cache.
     *
     * @memberof module:ov~SearchService
     * @instance
     * @param {String} [type] The cache element to clsear null to
     * clear all caches
     */
    function cacheClear() {
      videosCache = {};
      filters = {};
      categories = {};
      promotedVideos = {};
    }

    return {
      cacheClear: cacheClear,
      loadVideo: loadVideo,
      getFilters: getFilters,
      getCategories: getCategories,
      getCategoryName: getCategoryName,
      getPromotedVideos: getPromotedVideos,
      search: search
    };

  }

  app.factory('searchService', SearchService);
  SearchService.$inject = ['$http', '$q', 'webServiceBasePath'];

})(angular.module('ov.portal'));
