'use strict';

(function(app) {
  /**
   * Defines the home page controller.
   */
  function VideosController($scope, $location, searchService, videos, filters) {
    var reloadOnPageChange = false;
    $scope.videos = videos.data;
    $scope.filters = filters;
    $scope.pagination = angular.extend($scope.pagination ? $scope.pagination : {}, videos.paginate);
    $scope.showAdvancedSearch = false;

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
      searchService.search($scope.search, $scope.pagination).then(function(videos) {
        $scope.videos = videos.data;
        $scope.search = $location.search();
        $scope.pagination = videos.paginate;
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

  app.controller('VideosController', VideosController);
  VideosController.$inject = ['$scope', '$location', 'searchService', 'videos', 'filters'];

})(angular.module('ov.portal'));
