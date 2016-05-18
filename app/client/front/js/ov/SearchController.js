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
      if (searchTmp.dateEnd) searchTmp.dateEnd = new Date(searchTmp.dateStart);
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
      search.dateEnd = $filter('date')($scope.search.dateEnd, 'MM/dd/yyyy');
      paginateParam.page++;

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
        $analytics.trackSiteSearch($scope.search.query, $scope.search.categories, $scope.pagination.size);
      });
    }

    initSearch($location.search());

    $scope.searchSubmit = function() {
      $scope.showAdvancedSearch = false;
      if ($scope.search.query == '') delete $scope.search.query;
      if ($scope.search.sortOrder == false) delete $scope.search.sortOrder;
      if ($scope.search.sortBy == false) delete $scope.search.sortBy;
      $location.search($scope.search);
    };

    $scope.resetSearch = function() {
      initSearch({query: $scope.search.query});
    };

    $scope.orderOnChange = function() {
      $scope.searchSubmit();
    };

    $scope.$watch('pagination.pages', function(current, old) {
      if (!reloadOnPageChange) {
        var input = [];
        for (var i = 1; i <= current; i++) {
          input.push(i);
        }
        $scope.pages = input;
      }
    });

    $scope.$watch('pagination.page', function(current, old) {
      $scope.pagination.page = current;
      if (reloadOnPageChange) search();
      else reloadOnPageChange = true;
    });

    $scope.$on('$routeUpdate', function(event, route) {
      $scope.search = $location.search();
      if (!$scope.search.query) $scope.search.query = '';

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
  SearchController.$inject = ['$scope', '$location', '$q', '$filter',
   'searchService', 'result', 'filters', '$analytics'];

})(angular.module('ov.portal'));
