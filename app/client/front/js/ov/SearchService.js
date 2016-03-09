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
     */
    function getFilters() {
      var response = {origins: [], categories: [], names: []};

      for (var i = 0; i < 12; i++) {
        response.origins.push({label: 'origins' + i, id: i});
        response.categories.push({label: 'categories' + i, id: i});
        response.names.push({label: 'names' + i, id: i});
      }
      return $q.when(response);
    }

    /**
     * Loads the list of videos for Homepage
     *
     * @return {Promise} The Http promise
     * @method loadScopes
     * @return data
     */
    function searchHomeVideos() {

      // TODO replace this stub by server http call
      var response = {data: []};
      var date = new Date();
      for (var i = 0; i < 6; i++) {
        response.data.push(
          {
            title: 'home ' + i,
            type: 'youtube',
            date: date.getTime(),
            views: 25,
            thumbnail: 'http://www.tenstickers.fr/stickers/img/preview/sticker-affichage-mire-4537.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
                    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
                    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris' +
                    ' nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit' +
                    ' in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint ' +
                    'occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id ' +
                    'est laborum.',
            mediaId: 't4gjl-uwUHc',
            speaker: 'toto',
            category: 'category'
          }
        );
      }
      return $q.when(response);
    }

    /**
     *
     * @param {Object} params
     * @param {Object} paginate
     * @return data
     */
    function search(params, paginate) {

      // TODO replace this stub by server http call
      var keyword = params.key;
      var page = paginate ? paginate.page : 0;
      var count = Math.floor((Math.random() * 100) + 1);
      var response = {data: []};
      var date = new Date();
      for (var i = 0; i < 9; i++) {
        response.data.push(
          {
            title: keyword + ' ' + i,
            type: 'youtube',
            date: date.getTime(),
            views: 25,
            thumbnail: 'http://www.tenstickers.fr/stickers/img/preview/sticker-affichage-mire-4537.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
                    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
                    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris' +
                    ' nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit' +
                    ' in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint ' +
                    'occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id ' +
                    'est laborum.',
            mediaId: 't4gjl-uwUHc',
            speaker: 'toto',
            category: 'category'
          }
        );
      }

      response.paginate = {
        count: 9,
        page: page,
        pages: Math.ceil(count / 9),
        size: count
      };

      return $q.when(response);
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
