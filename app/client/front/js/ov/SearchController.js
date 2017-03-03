'use strict';

(function(app) {
  /**
   * Defines the home page controller.
   */
  function SearchController($scope, $location, $q, $filter, searchService, result, filters, $analytics) {
    var reloadOnPageChange = false;
    var canceller = $q.defer();

    $scope.videos = result.data.entities || [];
    $scope.filters = filters.data || {};
    $scope.pagination = angular.extend($scope.pagination ? $scope.pagination : {}, result.data.pagination);
    $scope.showAdvancedSearch = false;
    $scope.isLoading = false;

    /**
     * init search from location
     * @param {type} searchTmp
     * @returns {undefined}
     */
    function initSearch(searchTmp) {
      if (searchTmp.dateStart) searchTmp.dateStart = new Date(searchTmp.dateStart);
      if (searchTmp.dateEnd) searchTmp.dateEnd = new Date(searchTmp.dateEnd);
      $scope.search = angular.copy(searchTmp);
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

      search.sortBy = search.sortBy ? 'views' : 'date';
      search.sortOrder = search.sortOrder ? 'asc' : 'desc';
      search.dateStart = $filter('date')($scope.search.dateStart, 'MM/dd/yyyy');
      if ($scope.search.dateEnd) {
        var dateEnd = angular.copy($scope.search.dateEnd);
        dateEnd.setDate(dateEnd.getDate() + 1);
        search.dateEnd = $filter('date')(dateEnd, 'MM/dd/yyyy');
      }

      searchService.search(search, paginateParam, canceller).then(function(result) {
        if (result.data.error) {
          $scope.isLoading = false;
          $scope.showToast('error');
          return;
        }

        $scope.videos = result.data.entities;
        $scope.search = $location.search();
        $scope.pagination = result.data.pagination;
        $scope.isLoading = false;
        reloadOnPageChange = true;

        var searchQuery = ($scope.search.query) ? $scope.search.query : '';
        var searchCategories = ($scope.search.categories) ? $scope.search.categories : '';

        $analytics.trackSiteSearch(searchQuery, searchCategories, $scope.pagination.size);
      });
    }

    initSearch($location.search());

    $scope.searchSubmit = function() {
      var search = angular.copy($scope.search);
      $scope.showAdvancedSearch = false;

      // Clean search parameters to avoid conflicts
      $scope.search = searchService.cleanSearch(search);

      $location.search($scope.search);
    };

    $scope.resetSearch = function() {
      initSearch({query: $scope.search.query});
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
      $scope.search = $location.search();

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
