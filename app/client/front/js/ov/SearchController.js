'use strict';

(function(app) {

  /**
   * Defines the home page controller.
   */
  function SearchController($scope, $location, $q, searchService, filters, $analytics) {
    var reloadOnPageChange = false;
    var canceller = $q.defer();

    $scope.videos = [];
    $scope.filters = filters.data || [];
    $scope.pagination = {size: 0, page: 0, pages: 0, limit: 12};
    $scope.showAdvancedSearch = false;
    $scope.isLoading = true;

    /**
     * Converts timestamp into Date.
     *
     * If timestamp is actually a Date object, the Date object is returned without any conversion.
     *
     * @param {Number} timestamp Timestamp to transform into Date
     * @return {Date} The Date correponding to the given timestamp
     */
    function timestampToDate(timestamp) {
      return timestamp instanceof Date ? timestamp : new Date(Number(timestamp));
    }

    /**
     * Unserializes a value depending on the filter type.
     *
     * @param {Object} filter The filter corresponding to the specified value
     * @param {String} filter.type The filter type
     * @param {String|Number|Boolean} value The filter value
     * @return The unserialized value respecting the filter type
     */
    function unserializeFilterValue(filter, value) {
      if (filter.type === 'dateTime') return timestampToDate(value);
      if (filter.type === 'boolean') return JSON.parse(value);
      return value;
    }

    /**
     * Serialiazes a value depending on a filter type.
     *
     * @param {Object} filter The filter corresponding to the specified value
     * @param {String} filter.type The filter type
     * @param {String|Number|Boolean} value The filter value
     * @return The serialized filter value
     */
    function serializeFilterValue(filter, value) {
      if (filter.type === 'dateTime') return value.getTime();
      if (filter.type === 'boolean') return Number(value);
      return value;
    }

    /**
     * Serializes form values.
     *
     * @param {formValues} The key / value pairs of form value to serialize
     * @return The list of serialized form values
     */
    function serializeFormValues(formValues) {
      var values = {};

      // Sort
      values.sortBy = formValues.sortBy ? 'views' : 'date';
      values.sortOrder = formValues.sortOrder ? 'asc' : 'desc';

      // Date start and date end
      if (formValues.dateStart) values.dateStart = formValues.dateStart.getTime();
      if (formValues.dateEnd) {
        var dateEnd = new Date(formValues.dateEnd);
        dateEnd.setDate(dateEnd.getDate() + 1);
        values.dateEnd = dateEnd.getTime();
      }

      // Query
      if (formValues.query) values.query = formValues.query;

      // Points of interest
      values.searchInPois = Number(formValues.searchInPois);

      // Filters
      for (var id in formValues) {
        for (var i = 0; i < $scope.filters.length; i++) {
          var filter = $scope.filters[i];
          if (filter.id === id)
            values[id] = serializeFilterValue(filter, formValues[id]);
        }
      }

      return values;
    }

    /**
     * Prepares form values to be used as query parameters.
     *
     * @param {Object} formValues The key / value pairs of form value
     * @return The list of form values formatted for query parameters
     */
    function formValuesToQueryParameters(formValues) {
      return serializeFormValues(formValues);
    }

    /**
     * Builds search form model from given query parameters.
     *
     * @param {Object} parameters The key / value pairs of query parameters
     * @return {Object} The interpreted form values
     */
    function queryParametersToForm(parameters) {
      var values = {};

      // Date start and date end
      if (parameters.dateStart) values.dateStart = timestampToDate(parameters.dateStart);
      if (parameters.dateEnd) values.dateEnd = timestampToDate(parameters.dateEnd);

      // Query
      if (parameters.query) values.query = parameters.query;

      // Sort
      values.sortBy = parameters.sortBy === 'views';
      values.sortOrder = parameters.sortOrder === 'asc';

      // Filters
      $scope.filters.forEach(function(filter) {
        for (var id in parameters) {
          if (id === filter.id)
            values[id] = unserializeFilterValue(filter, parameters[id]);
        }

        if (values[filter.id] === undefined && filter.default)
          values[filter.id] = unserializeFilterValue(filter, filter.default);
      });

      // Points of interest
      if (parameters.searchInPois === undefined)
        values.searchInPois = Boolean(openVeoPortalSettings.search.pois);
      else
        values.searchInPois = Boolean(Number(parameters.searchInPois));

      return values;
    }

    /**
     * Makes a search call to the server.
     */
    function search() {
      $scope.isLoading = true;
      if (canceller) canceller.resolve();
      canceller = $q.defer();

      searchService.search(
        formValuesToQueryParameters($scope.search),
        $scope.pagination,
        canceller
      ).then(function(result) {
        if (result.data.error) {
          $scope.isLoading = false;
          $scope.showToast('error');
          return;
        }

        $scope.videos = result.data.entities;
        $scope.pagination = result.data.pagination;
        $scope.isLoading = false;
        reloadOnPageChange = true;

        var searchQuery = ($scope.search.query) ? $scope.search.query : '';
        var searchCategories = ($scope.search.categories) ? $scope.search.categories : '';

        $analytics.trackSiteSearch(searchQuery, searchCategories, $scope.pagination.size);
      });
    }

    // Listen to advanced search form submit
    $scope.searchSubmit = function() {
      $scope.showAdvancedSearch = false;
      $location.search(formValuesToQueryParameters($scope.search));
    };

    // Listen to advanced search form reset
    $scope.resetSearch = function() {
      $scope.search = queryParametersToForm({query: $scope.search.query});
    };

    // Listen to changes on the number of pages of results
    $scope.$watch('pagination.pages', function(current, old) {
      var input = [];
      for (var i = 1; i <= current; i++) input.push(i);
      $scope.pages = input;
    });

    // Listen to changes on the current page
    $scope.$watch('pagination.page', function(current, old) {
      $scope.pagination.page = current;
      if (reloadOnPageChange) search();
      else reloadOnPageChange = true;
    });

    // Listen to changes on location
    $scope.$on('$routeUpdate', function(event, route) {
      $scope.search = queryParametersToForm($location.search());

      if (!$scope.context || !$scope.context.keepContext) {
        reloadOnPageChange = false;
        $scope.pagination.page = 0;
        search();
      } else {
        $scope.context.keepContext = false;
      }
    });

    // Build model from query parameters
    $scope.search = queryParametersToForm($location.search());

    // Perform a search using current model
    search();

  }

  app.controller('SearchController', SearchController);
  SearchController.$inject = [
    '$scope',
    '$location',
    '$q',
    'searchService',
    'filters',
    '$analytics'
  ];

})(angular.module('ov.portal'));
