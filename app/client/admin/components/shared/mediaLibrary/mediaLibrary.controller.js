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
   * @param {Object} opaUrlFactory URL factory to manipulate URLs
   */
  function OpaMediaLibraryController($element, $http, opaWebServiceBasePath, opaUrlFactory) {
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
       * Indicates if next page loading is triggered
       *
       * @property triggered
       * @type Boolean
       */
      triggered: {
        value: false,
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
            var progress = this.scrollTop / (this.scrollHeight - this.clientHeight);

            if (progress < 0.7) {
              self.triggered = false;
            } else if (progress > 0.8 && self.triggered === false) {
              self.triggered = true;
              self.addNextPage();
            }
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
            .then(
              function(response) {
                self.isLoading = false;
                self.triggered = false;

                response.data.entities.forEach(function(entity) {
                  entity.preview = opaUrlFactory.setUrlParameter(entity.thumbnail, 'style', 'publish-square-142');
                });

                return callback(response);
              },
              function(error) {
                self.isLoading = false;
              });
        }
      }

    });
  }

  app.controller('OpaMediaLibraryController', OpaMediaLibraryController);
  OpaMediaLibraryController.$inject = ['$element', '$http', 'opaWebServiceBasePath', 'opaUrlFactory'];

})(angular.module('opa'));
