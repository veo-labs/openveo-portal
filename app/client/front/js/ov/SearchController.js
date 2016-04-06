'use strict';

(function(app) {
  /**
   * Defines the home page controller.
   */
  function SearchController($scope, $location, $q, searchService, result, filters, $analytics) {
    var reloadOnPageChange = false;
    var canceller = $q.defer();

    $scope.videos = result.data.rows || [];
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
      if (searchTmp.startDate) searchTmp.startDate = new Date(searchTmp.startDate);
      if (searchTmp.endDate) searchTmp.endDate = new Date(searchTmp.startDate);
      $scope.search = angular.copy(searchTmp);
    }

    /**
     * Search call to service
     */
    function search() {
      $scope.isLoading = true;
      if (canceller) canceller.resolve();
      canceller = $q.defer();
      searchService.search($scope.search, $scope.pagination, canceller).then(function(result) {
        if (result.data.error) {
          $scope.isLoading = false;
          $scope.showToast('error');
          return;
        }
        $scope.videos = result.data.rows;
        $scope.search = $location.search();
        $scope.pagination = result.data.pagination;
        $scope.isLoading = false;
        $analytics.trackSiteSearch($scope.search.key, $scope.search.categorie, $scope.pagination.size);
      });
    }

    initSearch($location.search());

    $scope.searchSubmit = function() {
      $scope.showAdvancedSearch = false;
      $location.search($scope.search);
    };

    $scope.resetSearch = function() {
      initSearch({key: $scope.search.key});
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

    $scope.$on('$routeUpdate', function() {
      $scope.search = $location.search();
      if (!$scope.search.key) $scope.search.key = '';
      reloadOnPageChange = false;
      $scope.pagination.page = 0;
      search();
    });
  }

  app.controller('SearchController', SearchController);
  SearchController.$inject = ['$scope', '$location', '$q', 'searchService', 'result', 'filters', '$analytics'];

})(angular.module('ov.portal'));
