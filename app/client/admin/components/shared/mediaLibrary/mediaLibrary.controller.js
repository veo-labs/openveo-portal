'use strict';

(function(app) {

  /**
   * Manages opaMediaLibrary component.
   *
   * @class OpaMediaLibraryController
   * @memberof module:opa/mediaLibrary
   * @inner
   * @constructor
   * @param {Object} opaUrlFactory URL factory to manipulate URLs
   */
  function OpaMediaLibraryController($element, $http, opaWebServiceBasePath, opaUrlFactory) {
    var self = this;

    Object.defineProperties(self,

      /** @lends module:opa/mediaLibrary~OpaMediaLibraryController */
      {

        /**
         * The list of medias present in the select.
         *
         * @type {Array}
         * @instance
         */
        medias: {
          value: [],
          writable: true
        },

        /**
         * Search keyword.
         *
         * @type {String}
         * @instance
         * @default null
         */
        keyword: {
          value: null,
          writable: true
        },

        /**
         * Medias sort field.
         *
         * @type {string}
         * @instance
         * @default 'date'
         */
        sortField: {
          value: 'date',
          writable: true
        },

        /**
         * Medias sort direction.
         *
         * @type {String}
         * @instance
         * @default 'desc'
         */
        sortDirection: {
          value: 'desc',
          writable: true
        },

        /**
         * Indicates if next page loading is triggered
         *
         * @type {Boolean}
         * @instance
         * @default false
         */
        triggered: {
          value: false,
          writable: true
        },

        /**
         * Number of results per page.
         *
         * @type {Number}
         * @instance
         * @default null
         */
        limit: {
          value: null,
          writable: true
        },

        /**
         * Current page.
         *
         * @type {Number}
         * @instance
         * @default null
         */
        currentPage: {
          value: null,
          writable: true
        },

        /**
         * Number of (filtered) pages.
         *
         * @type {Number}
         * @instance
         * @default null
         */
        totalPages: {
          value: null,
          writable: true
        },

        /**
         * Indicates if data is loading.
         *
         * @type {Boolean}
         * @instance
         * @default false
         */
        isLoading: {
          value: false,
          writable: true
        },

        /**
         * Initializes the constructor.
         *
         * @memberof module:opa/mediaLibrary~OpaMediaLibraryController
         * @method $onInit
         * @instance
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
         * @memberof module:opa/mediaLibrary~OpaMediaLibraryController
         * @method init
         * @instance
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
         * @memberof module:opa/mediaLibrary~OpaMediaLibraryController
         * @method search
         * @instance
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
         * @memberof module:opa/mediaLibrary~OpaMediaLibraryController
         * @method addNextPage
         * @instance
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
         * @memberof module:opa/mediaLibrary~OpaMediaLibraryController
         * @method fetch
         * @instance
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

      }

    );
  }

  app.controller('OpaMediaLibraryController', OpaMediaLibraryController);
  OpaMediaLibraryController.$inject = ['$element', '$http', 'opaWebServiceBasePath', 'opaUrlFactory'];

})(angular.module('opa'));
