'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaMediaLibrary component.
   *
   * @class OpaMediaLibraryController
   * @constructor
   */
  function OpaMediaLibraryController($element, $http, opaWebServiceBasePath) {
    var self = this;

    Object.defineProperties(self, {

      /**
       * The list of medias present in the select.
       *
       * @property medias
       * @type Array
       */
      medias: {
        value: [],
        writable: true
      },

      /**
       * Search keyword.
       *
       * @property search
       * @type String
       */
      keyword: {
        value: null,
        writable: true
      },

      /**
       * Medias sort field.
       *
       * @property sortField
       * @type string
       */
      sortField: {
        value: 'date',
        writable: true
      },

      /**
       * Medias sort direction.
       *
       * @property sortDirection
       * @type String
       */
      sortDirection: {
        value: 'desc',
        writable: true
      },

      /**
       * Number of results per page.
       *
       * @property limit
       * @type Number
       */
      limit: {
        value: null,
        writable: true
      },

      /**
       * Current page.
       *
       * @property currentPage
       * @type Number
       */
      currentPage: {
        value: null,
        writable: true
      },

      /**
       * Number of (filtered) pages.
       *
       * @property totalPages
       * @type Number
       */
      totalPages: {
        value: null,
        writable: true
      },

      /**
       * Indicates if data is loading.
       *
       * @property isLoading
       * @type Boolean
       */
      isLoading: {
        value: false,
        writable: true
      },

      /**
       * Initializes the constructor.
       *
       * @method $onInit
       * @final
       */
      $onInit: {
        value: function() {
          self.limit = self.opaResultsPerPage || 25;
          self.init();

          var select = $element.find('opa-media-select');
          var container = select.parent();

          container.on('scroll', function() {
            if (this.scrollTop / (this.scrollHeight - this.clientHeight) < 0.8)
              return;

            self.addNextPage();
          });
        }
      },

      /**
       * Initialize first media fetch.
       *
       * @method init
       * @final
       */
      init: {
        value: function() {
          self.keyword = null;
          self.search();
        }
      },

      /**
       * Loads the first page of a new search.
       *
       * @method search
       * @final
       */
      search: {
        value: function() {
          self.currentPage = null;
          self.totalPages = null;

          self.fetch(function(response) {
            self.currentPage = 1;
            self.totalPages = response.data.pagination.pages;
            self.medias = response.data.entities;
          });
        }
      },

      /**
       * Loads the next page of medias.
       *
       * @method addNextPage
       * @final
       */
      addNextPage: {
        value: function() {
          if (self.currentPage === self.totalPages) {
            return;
          }

          self.fetch(function(response) {
            self.currentPage++;
            self.medias = self.medias.concat(response.data.entities);
          });
        }
      },

      /**
       * Calls the Web Service for medias fetching.
       *
       * @method fetch
       * @final
       */
      fetch: {
        value: function(callback) {
          if (self.isLoading)
            return;

          self.isLoading = true;

          var data = {
            filter: {
              sortBy: self.sortField,
              sortOrder: self.sortDirection,
              include: ['id', 'title', 'date', 'thumbnail']
            },
            pagination: {
              limit: self.limit
            }
          };

          if (self.keyword)
            data.filter.query = self.keyword;

          if (self.currentPage)
            data.pagination.page = self.currentPage;

          $http
            .post(opaWebServiceBasePath + 'videos', data)
            .then(function(response) {
              self.isLoading = false;

              response.data.entities.forEach(function(entity) {
                var preview = new URL(entity.thumbnail);
                preview.searchParams.append('style', 'publish-square-142');
                entity.preview = preview.href;
              });

              return callback(response);
            });
        }
      }

    });
  }

  app.controller('OpaMediaLibraryController', OpaMediaLibraryController);
  OpaMediaLibraryController.$inject = ['$element', '$http', 'opaWebServiceBasePath'];

})(angular.module('opa'));
