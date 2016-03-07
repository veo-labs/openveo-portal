'use strict';

(function(app) {

  /**
   * Defines service to manage the video search.
   *
   * @module ov
   * @class applicationService
   */
  function SearchService($http, $q) {

    /**
     *
     * @return filters
     * {
        origins: [
          {
            id: 0,
            label: 'aucun'
          },
          ...
        ],
        categories: [
          {
            id: 0,
            label: 'aucun'
          },
          ...
        ],
        names: [
          {
            id: 0,
            label: 'aucun'
          },
          ...
        ]
      }
     */
    function getFilters() {
    }

    /**
     * Loads the list of videos for Homepage
     *
     * @return {Promise} The Http promise
     * @method loadScopes
     * @return data
     * {data: [
          {
            title: keyword + '1',
            date: 1457023291,
            views: 25,
            thumbnail: image,
            id: 'efzefzef'
          },
        ...
        ]}}
     */
    function searchHomeVideos() {
    }

    /**
     *
     * @param {Object} params
     * @param {Object} paginate
     * @return data
     *  {
        paginate: {
          count: 9,
          page: 1,
          pages: 2,
          size: 18
        },
        data: [
          {
            title: "title1",
            date: 1457023291,
            views: 25,
            thumbnail: 'http://path/to/thumbnail',
            id: '4ef67bc2'
          },
        ...
        ]}
     */
    function search(params, paginate) {
    }

    return {
      getFilters: getFilters,
      searchHomeVideos: searchHomeVideos,
      search: search
    };

  }

  app.factory('searchService', SearchService);
  SearchService.$inject = ['$http', '$q'];

})(angular.module('ov.portal'));
