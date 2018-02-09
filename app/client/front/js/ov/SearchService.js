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
        return $http.get(basePath + 'getvideo/' + id).then(function(response) {
          videosCache[id] = response.data.entity;
          return response;
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
      if (!filters || !Object.keys(filters).length) {
        return $http.get(basePath + 'filters').then(function(response) {
          filters = response.data;
          return response;
        });
      }

      return $q.when({data: filters});
    }


    /**
     *
     * @return categories
     */
    function getCategories() {
      if (!categories || !Object.keys(categories).length) {
        return $http.get(basePath + 'categories').then(function(response) {
          categories = response.data;
          return response;
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

      if (!homeVideos || !Object.keys(homeVideos).length) {

        var params = {
          filter: {
            sortBy: 'date',
            sortOrder: 'desc'
          },
          pagination: {
            page: 0,
            limit: 9
          }
        };
        return $http.post(basePath + 'videos', params).then(function(response) {
          homeVideos = response.data;
          return response;
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
      return $http.post(basePath + 'videos', params, options);
    }

    /**
     * Clears a search service cache.
     *
     * @param {String} [type] The cache element to clsear null to
     * clear all caches
     * @method cacheClear
     */
    function cacheClear() {
      videosCache = {};
      filters = {};
      categories = {};
      homeVideos = {};
    }

    /**
     * Clears search parameters to avoid conflicts
     *
     * @param  {Object} params
     * @return {Object} clean search params
     */
    function cleanSearch(params) {
      var paramsKeys = Object.keys(params);
      var paramsCopy = angular.copy(params);

      paramsKeys.map(function(value) {
        if (paramsCopy[value] === '' || paramsCopy[value] === false || paramsCopy[value] === 'false') {
          delete params[value];
        }
      });

      return params;
    }

    return {
      cacheClear: cacheClear,
      loadVideo: loadVideo,
      getFilters: getFilters,
      getCategories: getCategories,
      getCategoryName: getCategoryName,
      searchHomeVideos: searchHomeVideos,
      search: search,
      cleanSearch: cleanSearch
    };

  }

  app.factory('searchService', SearchService);
  SearchService.$inject = ['$http', '$q'];

})(angular.module('ov.portal'));
