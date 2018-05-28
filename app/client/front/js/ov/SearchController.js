'use strict';

(function(app) {
  /**
   * Defines the home page controller.
   */
  function SearchController($scope, $location, $q, $filter, searchService, result, filters, $analytics) {
    var reloadOnPageChange = false;
    var canceller = $q.defer();

    $scope.videos = result.data.entities || [];
    $scope.filters = filters.data || [];
    $scope.pagination = angular.extend($scope.pagination ? $scope.pagination : {}, result.data.pagination);
    $scope.showAdvancedSearch = false;
    $scope.isLoading = false;

    /**
     * Gets search parameters from query parameters.
     *
     * @param {Object} queryParameters The key / value pairs of query parameters
     */
    function buildSearchParameters(queryParameters) {
      var searchParameters = angular.copy(queryParameters);
      if (searchParameters.dateStart) searchParameters.dateStart = new Date(Number(searchParameters.dateStart));
      if (searchParameters.dateEnd) searchParameters.dateEnd = new Date(Number(searchParameters.dateEnd));

      // Convert dateTime filters (timestamps) into dates
      for (var filter in searchParameters) {
        for (var i = 0; i < $scope.filters.length; i++) {
          if (filter === $scope.filters[i].id) {
            if ($scope.filters[i].type === 'dateTime')
              searchParameters[filter] = new Date(Number(searchParameters[filter]));

            break;
          }
        }
      }

      return searchParameters;
    }

    /**
     * Search call to service
     */
    function search() {
      $scope.isLoading = true;
      if (canceller) canceller.resolve();
      canceller = $q.defer();

      var search = angular.copy($scope.search);
      var paginateParam = angular.copy($scope.pagination);

      // Convert dates into timestamps
      for (var name in search) {
        if (search[name] instanceof Date)
          search[name] = search[name].getTime();
      }

      if (search.dateEnd) {
        var dateEnd = new Date(search.dateEnd);
        dateEnd.setDate(dateEnd.getDate() + 1);
        search.dateEnd = dateEnd.getTime();
      }

      search.sortBy = search.sortBy ? 'views' : 'date';
      search.sortOrder = search.sortOrder ? 'asc' : 'desc';

      searchService.search(search, paginateParam, canceller).then(function(result) {
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

    $scope.search = buildSearchParameters($location.search());

    $scope.searchSubmit = function() {
      var search = angular.copy($scope.search);
      $scope.showAdvancedSearch = false;

      // Clean search parameters to avoid conflicts
      search = searchService.cleanSearch(search);

      // Convert dates into timestamps
      for (var name in search) {
        if (search[name] instanceof Date)
          search[name] = search[name].getTime();
      }

      $location.search(search);
    };

    $scope.resetSearch = function() {
      $scope.search = buildSearchParameters({query: $scope.search.query});
    };

    $scope.orderOnChange = function() {
      $scope.searchSubmit();
    };

    $scope.$watch('pagination.pages', function(current, old) {
      var input = [];
      for (var i = 1; i <= current; i++) {
        input.push(i);
      }
      $scope.pages = input;
    });

    $scope.$watch('pagination.page', function(current, old) {
      $scope.pagination.page = current;
      if (reloadOnPageChange) search();
      else reloadOnPageChange = true;
    });

    $scope.$on('$routeUpdate', function(event, route) {
      $scope.search = buildSearchParameters($location.search());

      if (!$scope.context || !$scope.context.keepContext) {
        reloadOnPageChange = false;
        $scope.pagination.page = 0;
        search();
      } else {
        $scope.context.keepContext = false;
      }
    });
  }

  app.controller('SearchController', SearchController);
  SearchController.$inject = [
    '$scope',
    '$location',
    '$q',
    '$filter',
    'searchService',
    'result',
    'filters',
    '$analytics'
  ];

})(angular.module('ov.portal'));
